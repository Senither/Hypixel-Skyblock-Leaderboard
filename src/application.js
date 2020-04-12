
const Config = require('../config.json');

class Application {
    async bootstrap() {
        console.log('Connecting to database and running migrations');

        const Database = require('./database/database');
        this.database = new Database();

        return this.database.runMigrations();
    }

    async register() {
        console.log('Creating job manager and registering tasks');
        this.jobs = require('./jobs/manager');
        this.jobs.register(this, 'updateTask');

        console.log('Setting up axios for outgoing HTTP requests');
        const axios = require('axios');
        this.http = axios.create({
            baseURL: Config.api_url,
            headers: {'Authorization': `Bearer ${Config.api_token}`},
            timeout: 10000
        });

        console.log('Registering any new guild IDs with the database');
        await this.database.getClient().table('guilds').whereNotIn('uuid', Config.guilds).del();

        for (let guildId of Config.guilds) {
            let guild = await this.database.getClient().table('guilds').where('uuid', guildId).first();
            if (guild == undefined) {
                console.log(`No guild with an UUID of ${guildId} where found, creating entry`);
                this.database.insert('guilds', {
                    uuid: guildId
                });
            }
        }

        return Promise.resolve();
    }

    async connect() {
        console.log('Creating web servlet and registering routes');
        const express = require('express');
        this.servlet = express();
        this.servlet.get('/', require('./routes/getGuilds'));
        this.servlet.get('/stats', require('./routes/getStats'));
        this.servlet.use((request, response, next) => {
            response.status(404);
            response.json({ status: 404, error: 'Route was not found' });
        });

        console.log(`Starting listening for requests on port ${Config.port}`);
        this.servlet.listen(Config.port);
    }
}

module.exports = new Application;
