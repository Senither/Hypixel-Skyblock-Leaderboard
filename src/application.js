
const Config = require('../config.json');

class Application {
    bootstrap() {
        console.log('Connecting to database and running migrations');

        const Database = require('./database/database');
        this.database = new Database();

        return this.database.runMigrations();
    }

    register() {
        console.log('Creating job manager and registering tasks');
        this.jobs = require('./jobs/manager');
        this.jobs.register(this, 'updateTask');
    }

    connect() {
        console.log('Creating web servlet and registering routes');
        const express = require('express');
        this.servlet = express();
        this.servlet.get('/', require('./routes/getGuilds'));

        console.log(`Starting listening for requests on port ${Config.port}`);
        this.servlet.listen(Config.port);
    }
}

module.exports = new Application;
