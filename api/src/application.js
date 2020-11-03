const Logger = require('./logger/winston');
const Config = require('../config.json');

class Application {
    async bootstrap() {
        Logger.info('Connecting to database and running migrations');

        const Database = require('./database/database');
        this.database = new Database();

        return this.database.runMigrations();
    }

    async register() {
        Logger.info('Creating job manager and registering tasks');
        this.jobs = require('./jobs/manager');
        this.jobs.register(this, 'updateTask');
        this.jobs.register(this, 'cleanupMetrics');
        this.jobs.register(this, 'resolveHistoryUsernames');

        Logger.info('Setting up axios for outgoing HTTP requests');
        const axios = require('axios');
        this.http = axios.create({
            baseURL: Config.api_url,
            headers: {'Authorization': `Bearer ${Config.api_token}`},
            timeout: 10000
        });

        Logger.info('Registering any new guild IDs with the database');
        await this.database.getClient().table('guilds').whereNotIn('uuid', Object.keys(Config.guilds)).del();

        for (let guildId of Object.keys(Config.guilds)) {
            let guild = await this.database.getClient().table('guilds').where('uuid', guildId).first();
            if (guild == undefined) {
                Logger.info(`No guild with an UUID of ${guildId} where found, creating entry`);
                this.database.insert('guilds', {
                    uuid: guildId
                });
            }
        }

        Logger.info('Deleting unused player and metric records from the database');
        await this.database.getClient().raw(
            'DELETE `players` FROM `players` LEFT JOIN `guilds` ON `players`.`guild_id` = `guilds`.`id` WHERE `id` IS NULL'
        );
        await this.database.getClient().raw(
            'DELETE `metrics` FROM `metrics` LEFT JOIN `guilds` ON `metrics`.`guild_id` = `guilds`.`id` WHERE `guilds`.`id` IS NULL'
        );

        return Promise.resolve();
    }

    async connect() {
        Logger.info('Creating web servlet and registering routes');
        const express = require('express');
        this.servlet = express();
        this.servlet.use((request, response, next) => {
            response.header('Access-Control-Allow-Origin', '*');
            response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            next();
        });

        this.servlet.get('/', require('./routes/getGuilds'));
        this.servlet.get('/stats', require('./routes/getStats'));
        this.servlet.get('/players', require('./routes/getPlayers'));
        this.servlet.get('/history', require('./routes/getHistory'));
        this.servlet.get('/player/:id', require('./routes/getPlayerMetrics'));
        this.servlet.get('/metrics/:id', require('./routes/getGuildMetrics'));
        this.servlet.get('/players/:id', require('./routes/getGuildPlayers'));

        this.servlet.use((request, response, next) => {
            response.status(404);
            response.json({ status: 404, error: 'Route was not found' });
        });

        Logger.info(`Starting listening for requests on port ${Config.port}`);
        this.servlet.listen(Config.port);
    }
}

module.exports = new Application;
