
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

    run(app) {
        if (! this.hasData()) {
            return this.setLastUpdatedGuild(app);
        }

        if (this.members.length == 0) {
            return this.updateAveragesForGuild(app);
        }

        return this.updatePlayerForGuild(app, this.members.pop());
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

        console.log(`Beginning guild scan for ${this.guild.uuid} (${this.guild.name})`);

        app.http.get(`guild/${this.guild.uuid}`).then(response => {
            let guild = response.data.data;

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
        });
    }

    async updateAveragesForGuild(app) {
        console.log('The guild scan has finished, calculating averages and updating DB records');

        let summedSlayer = 0, slayerPlayers = 0;
        let summedSkills = 0, skillsPlayers = 0;

        for (let entry of this.profiles) {
            if (entry.slayer > 1000) {
                summedSlayer += entry.slayer;
                slayerPlayers++;
            }

            if (entry.skill > 5) {
                summedSkills += entry.skill;
                skillsPlayers++;
            }
        }

        app.database.update('guilds', {
            average_skill: summedSkills / skillsPlayers,
            average_slayer: summedSlayer / slayerPlayers,
            members: this.profiles.length,
            last_updated_at: new Date
        }, query => query.where('id', this.guild.id));

        app.database.insert('metrics', {
            guild_id: this.guild.id,
            average_skill: summedSkills / skillsPlayers,
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

        let updateableContent = {
            guild_id: this.guild.id,
            uuid: result.uuid,
            username: result.username,
            average_skill: result.stats.skills.average_skills_progress,
            total_slayer: result.stats.slayer.total_experience,
            mining: result.stats.skills.skills.mining.level,
            foraging: result.stats.skills.skills.foraging.level,
            enchanting: result.stats.skills.skills.enchanting.level,
            farming: result.stats.skills.skills.farming.level,
            combat: result.stats.skills.skills.combat.level,
            fishing: result.stats.skills.skills.fishing.level,
            alchemy: result.stats.skills.skills.alchemy.level,
            carpentry: result.stats.skills.skills.carpentry.level,
            runecrafting: result.stats.skills.skills.runecrafting.level,
            last_updated_at: new Date
        };

        this.profiles.push({
            slayer: result.stats.slayer.total_experience,
            skill: result.stats.skills.average_skills_progress
        });

        if (record == null || record == undefined) {
            app.database.insert('players', updateableContent);
        } else {
            app.database.update('players', updateableContent, query => {
                return query.where('uuid', result.uuid);
            });
        }
    }
}

module.exports = UpdateTask;
