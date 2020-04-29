
const Task = require('../task');

class UpdateTask extends Task {
    constructor() {
        super();

        this.guild = null;
        this.members = null;
        this.profiles = null;
    }

    interval() {
        return 10 * 1000;
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
            console.error('An error occurred while trying to update player data for: ' + member.uuid, error.message);

            if (! member.hasOwnProperty('updateAttempts')) {
                member.updateAttempts = 0;
            }

            if (member.updateAttempts++ < 5) {
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
                    last_updated_at: new Date
                }, query => query.where('id', this.guild.id));
            }
            return;
        }

        console.log(`Beginning guild scan for ${this.guild.uuid} (${this.guild.name})`);

        this.members = guild.members;
        this.profiles = [];

        let uuids = [];
        guild.members.forEach(member => uuids.push(member.uuid));

        app.database.update('players', {
            guild_id: null
        }, query => {
            return query.whereNotIn('uuid', uuids)
                        .andWhere('guild_id', this.guild.id);
        });

        app.database.update('guilds', {
            name: guild.name,
            members: guild.members.length,
            data: JSON.stringify(guild.members)
        }, query => query.where('uuid', guild.id));
    }

    async updateAveragesForGuild(app) {
        console.log('The guild scan has finished, calculating averages and updating DB records');

        let summedSlayer = 0, slayerPlayers = 0;
        let summedSkills = 0, summedSkillsProgress = 0, skillsPlayers = 0;

        for (let entry of this.profiles) {
            if (entry.slayer > 1000) {
                summedSlayer += entry.slayer;
                slayerPlayers++;
            }

            if (entry.skill > 5) {
                summedSkills += entry.skill;
                summedSkillsProgress += entry.skill_progress;
                skillsPlayers++;
            }
        }

        app.database.update('guilds', {
            average_skill: summedSkills / skillsPlayers,
            average_skill_progress: summedSkillsProgress / skillsPlayers,
            average_slayer: summedSlayer / slayerPlayers,
            members: this.profiles.length,
            last_updated_at: new Date
        }, query => query.where('id', this.guild.id));

        app.database.insert('metrics', {
            guild_id: this.guild.id,
            average_skill: summedSkills / skillsPlayers,
            average_skill_progress: summedSkillsProgress / skillsPlayers,
            average_slayer: summedSlayer / slayerPlayers,
            members: this.profiles.length
        });

        this.guild = null;
        this.members = null;
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

        this.profiles.push({
            slayer: result.stats.slayer.total_experience,
            skill_progress: result.stats.skills.average_skills_progress,
            skill: result.stats.skills.average_skills
        });

        if (record == null || record == undefined) {
            app.database.insert('players', this.createUpdateableContentFromResult(result));
        } else {
            app.database.update('players', this.createUpdateableContentFromResult(result), query => {
                return query.where('uuid', result.uuid);
            });
        }
    }

    createUpdateableContentFromResult(result) {
        return {
            guild_id: this.guild.id,
            uuid: result.uuid,
            username: result.username,
            average_skill_progress: result.stats.skills.average_skills_progress,
            average_skill: result.stats.skills.average_skill,
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
            carpentry: result.stats.skills.skills.carpentry.level,
            carpentry_xp: result.stats.skills.skills.carpentry.experience,
            runecrafting: result.stats.skills.skills.runecrafting.level,
            runecrafting_xp: result.stats.skills.skills.runecrafting.experience,
            last_updated_at: new Date
        };
    }
}

module.exports = UpdateTask;
