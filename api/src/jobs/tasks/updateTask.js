
const Task = require('../task');

class UpdateTask extends Task {
    constructor() {
        super();

        this.guild = null;
        this.members = null;
        this.history = null;
        this.profiles = null;
    }

    interval() {
        return 5 * 1000;
    }

    async run(app) {
        if (! this.hasData()) {
            return await this.setLastUpdatedGuild(app).catch(error => {
                console.warn('Failed to fetch guild data to begin the guild scan, error: ', error.message);
            });
        }

        if (this.members.length == 0) {
            return this.updateAveragesForGuild(app);
        }

        let member = this.members.pop();

        this.updatePlayerForGuild(app, member).catch(error => {
            let hasErrorStatusCode = error != undefined
                && error.hasOwnProperty('response')
                && error.response != undefined
                && error.response.hasOwnProperty('status')
                && error.response.status != undefined;

            if (hasErrorStatusCode && error.response.status == 410) {
                if (! member.hasOwnProperty('updateAttempts')) {
                    member.updateAttempts = 1;
                    this.members.push(member);

                    return console.warn(`${member.uuid} does not have any valid SkyBlock profiles, retrying once!`);
                }

                return console.warn(`${member.uuid} does not have any valid SkyBlock profiles, skipping!`);
            }


            if (! member.hasOwnProperty('updateAttempts')) {
                member.updateAttempts = 0;
            }

            console.error('An error occurred while trying to update player data for: ' + member.uuid, error.message);

            if (member.updateAttempts++ < 5) {
                let retrying = `retrying ${5 - member.updateAttempts} more times`;

                if (hasErrorStatusCode && error.response.status == 500) {
                    console.error(`The server responded with a internal error code(500), ${retrying}! Message: `, error.message);
                } else if (error.message.includes('timeout of')) {
                    console.error(`The request timed out for ${member.uuid}, ${retrying}!`)
                } else {
                    console.error(`An unknown error occurred while trying to update player data for ${member.uuid}, ${retrying}, error:`, error.message);
                }

                this.members.push(member);
            }
        });
    }

    hasData() {
        return this.guild != null
            && this.guild != undefined
            && this.members != null;
    }

    async setLastUpdatedGuild(app) {
        console.log('Looking up guilds to update stats for...');

        let time = new Date;
        time.setDate(time.getDate() - 1);

        this.members = null;
        this.history = null;
        this.profiles = null;
        this.guild = await app.database.getClient()
            .table('guilds')
            .where('last_updated_at', '<', time)
            .orderBy('last_updated_at')
            .first();

        if (this.guild == null && this.guild == undefined) {
            console.log(' - No guilds that are ready to be updated were found!');
            return;
        }

        console.log(`Loading guild data from the API for ${this.guild.uuid} (${this.guild.name})`);

        let guild = null;
        try {
            let response = await app.http.get(`guild/${this.guild.uuid}`);
            guild = response.data.data;
        } catch (e) {
            if (e.response.status == 404) {
                console.warn(`Failed to find ${this.guild.uuid} (${this.guild.name}), API responded with a 404!`);
                console.warn('Skipping guild for now!');

                app.database.update('guilds', {
                    last_updated_at: new Date,
                    last_skipped_at: new Date,
                }, query => query.where('id', this.guild.id));
            }
            return;
        }

        console.log(`Beginning guild scan for ${this.guild.uuid} (${this.guild.name})`);

        this.members = guild.members;
        this.profiles = [];

        let uuids = [];
        guild.members.forEach(member => uuids.push(member.uuid));

        let oldMembers = await app.database.getClient()
            .table('players')
            .where('guild_id', this.guild.id);

        oldMembers = oldMembers.map(row => row.uuid);

        let membersWhoJoined = uuids.filter(uuid => ! oldMembers.includes(uuid));
        let membersWhoLeft = oldMembers.filter(uuid => ! uuids.includes(uuid));

        let memberHistoryUsernames = await app.database.getClient()
            .table('players')
            .select(['uuid', 'username'])
            .whereIn('uuid', membersWhoJoined.concat(membersWhoLeft));

        this.history = {
            uuids: uuids,
            joined: await this.convertUUIDArrayToHistoryObjects(app, membersWhoJoined, memberHistoryUsernames, 0),
            left: await this.convertUUIDArrayToHistoryObjects(app, membersWhoLeft, memberHistoryUsernames, 1),
        }

        app.database.update('guilds', {
            name: guild.name,
            members: guild.members.length,
            data: JSON.stringify(guild.members)
        }, query => query.where('uuid', guild.id));
    }

    async updateAveragesForGuild(app) {
        console.log('The guild scan has finished, calculating averages and updating DB records');

        let summedSlayer = 0, slayerPlayers = 0;
        let summedCatacombs = 0, catacombsPlayers = 0;
        let summedSkills = 0, summedSkillsProgress = 0, skillsPlayers = 0;

        for (let entry of this.profiles) {
            if (entry.total_slayer > 1000) {
                summedSlayer += entry.total_slayer;
                slayerPlayers++;
            }

            if (entry.catacomb > 0) {
                summedCatacombs += entry.catacomb;
                catacombsPlayers++;
            }

            if (entry.average_skill > 5) {
                summedSkills += entry.average_skill;
                summedSkillsProgress += entry.average_skill_progress;
                skillsPlayers++;
            }

            delete entry.guild_id;
            delete entry.username;
            delete entry.last_updated_at;

            app.database.insert('player_metrics', entry);
        }

        app.database.update('players', {
            guild_id: null
        }, query => {
            return query.whereNotIn('uuid', this.history.uuids)
                        .andWhere('guild_id', this.guild.id);
        });

        if (this.history.left.length > 0) {
            app.database.insert('history', this.history.left);
        }

        if (this.history.joined.length > 0) {
            app.database.insert('history', this.history.joined);
        }

        app.database.update('guilds', {
            average_skill: summedSkills / skillsPlayers,
            average_skill_progress: summedSkillsProgress / skillsPlayers,
            average_slayer: summedSlayer / slayerPlayers,
            average_catacomb: summedCatacombs / catacombsPlayers,
            members: this.profiles.length,
            last_updated_at: new Date,
            last_skipped_at: null,
        }, query => query.where('id', this.guild.id));

        app.database.insert('metrics', {
            guild_id: this.guild.id,
            average_skill: summedSkills / skillsPlayers,
            average_skill_progress: summedSkillsProgress / skillsPlayers,
            average_slayer: summedSlayer / slayerPlayers,
            average_catacomb: summedCatacombs / catacombsPlayers,
            members: this.profiles.length,
        });

        this.guild = null;
        this.members = null;
        this.history = null;
        this.profiles = null;
    }

    async updatePlayerForGuild(app, player) {
        console.log(`Looking up stats for ${player.uuid} (${this.profiles.length} out of ${this.members.length + this.profiles.length + 1})`);

        let response = await app.http.get(`player/${player.uuid}`);
        if (response.status != 200) {
            return console.warn(`The player API didn't return a 200 status code for ${player.uuid}`);
        }

        let result = response.data.data;
        let record = await app.database.getClient().table('players').where('uuid', result.uuid).first();

        let updateableContent = this.createUpdateableContentFromResult(result);

        this.profiles.push(updateableContent);

        if (record == null || record == undefined) {
            app.database.insert('players', updateableContent);
        } else {
            app.database.update('players', updateableContent, query => {
                return query.where('uuid', result.uuid);
            });
        }
    }

    async convertUUIDArrayToHistoryObjects(app, uuids, history, type) {
        return Promise.all(uuids.map(async (uuid) => {
            let record = history.find(record => record.uuid == uuid);
            if (record == undefined) {
                let response = await app.http.get(`/username?uuid=${uuid}`);
                let result = response.data.data;

                if (result.hasOwnProperty(uuid)) {
                    record = { username: result[uuid] };
                }
            }

            return {
                guild_id: this.guild.id,
                type: type,
                uuid: uuid,
                username: record == undefined ? null : record.username,
                created_at: new Date,
                updated_at: new Date,
            };
        }));
    }

    createUpdateableContentFromResult(result) {
        const { classes, types } = result.stats.dungeons;

        return {
            guild_id: this.guild.id,
            uuid: result.uuid,
            username: result.username,
            average_skill_progress: result.stats.skills.average_skills_progress,
            average_skill: result.stats.skills.average_skills,
            catacomb: types.hasOwnProperty('catacombs') ? types.catacombs.level : 0,
            catacomb_xp: types.hasOwnProperty('catacombs') ? types.catacombs.experience : 0,
            healer: classes.hasOwnProperty('healer') ? classes.healer.level : 0,
            healer_xp: classes.hasOwnProperty('healer') ? classes.healer.experience : 0,
            mage: classes.hasOwnProperty('mage') ? classes.mage.level : 0,
            mage_xp: classes.hasOwnProperty('mage') ? classes.mage.experience : 0,
            berserk: classes.hasOwnProperty('berserk') ? classes.berserk.level : 0,
            berserk_xp: classes.hasOwnProperty('berserk') ? classes.berserk.experience : 0,
            archer: classes.hasOwnProperty('archer') ? classes.archer.level : 0,
            archer_xp: classes.hasOwnProperty('archer') ? classes.archer.experience : 0,
            tank: classes.hasOwnProperty('tank') ? classes.tank.level : 0,
            tank_xp: classes.hasOwnProperty('tank') ? classes.tank.experience : 0,
            total_slayer: result.stats.slayer.total_experience,
            revenant_xp: result.stats.slayer.bosses.revenant.experience,
            tarantula_xp: result.stats.slayer.bosses.tarantula.experience,
            sven_xp: result.stats.slayer.bosses.sven.experience,
            mining: result.stats.skills.skills.mining.level,
            mining_xp: result.stats.skills.skills.mining.experience,
            foraging: result.stats.skills.skills.foraging.level,
            foraging_xp: result.stats.skills.skills.foraging.experience,
            enchanting: result.stats.skills.skills.enchanting.level,
            enchanting_xp: result.stats.skills.skills.enchanting.experience,
            farming: result.stats.skills.skills.farming.level,
            farming_xp: result.stats.skills.skills.farming.experience,
            combat: result.stats.skills.skills.combat.level,
            combat_xp: result.stats.skills.skills.combat.experience,
            fishing: result.stats.skills.skills.fishing.level,
            fishing_xp: result.stats.skills.skills.fishing.experience,
            alchemy: result.stats.skills.skills.alchemy.level,
            alchemy_xp: result.stats.skills.skills.alchemy.experience,
            taming: result.stats.skills.skills.taming.level,
            taming_xp: result.stats.skills.skills.taming.experience,
            carpentry: result.stats.skills.skills.carpentry.level,
            carpentry_xp: result.stats.skills.skills.carpentry.experience,
            runecrafting: result.stats.skills.skills.runecrafting.level,
            runecrafting_xp: result.stats.skills.skills.runecrafting.experience,
            last_updated_at: new Date
        };
    }
}

module.exports = UpdateTask;
