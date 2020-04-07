
class Application {
    bootstrap() {
        console.log('Connecting to database and running migrations');

        const Database = require('./database/database');
        this.database = new Database();

        return this.database.runMigrations();
    }

    register() {
        // Registering events, jobs & services
    }

    connect() {
        // Creating web server and listening for requests
    }
}

module.exports = new Application;
