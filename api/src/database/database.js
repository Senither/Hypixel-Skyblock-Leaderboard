
const Knex = require('knex');
const Logger = require('../logger/winston');
const Config = require('../../config.json');

class Database {
    constructor() {
        this.client = new Knex({
            client: Config.database.type,
            connection: Config.database,
            pool: {
                min: 2,
                max: 18
            },
            migrations: {
                tableName: 'migrations',
                directory: './src/database/migrations'
            },
            useNullAsDefault: true
        });
    }

    runMigrations() {
        return new Promise((resolve, reject) => {
            this.getClient().migrate.latest().then(() => {
                resolve();
            }).catch(err => {
                Logger.error('Failed to run/update database migrations.', err);
                reject(err);
            });
        });
    }

    getClient() {
        return this.client;
    }

    insert(table, fields, timestamps = true) {
        return new Promise((resolve, reject) => {
            if (timestamps) {
                fields.created_at = new Date;
                fields.updated_at = new Date;
            }

            return this.getClient().insert(fields).into(table).catch(err => reject(err));
        });
    }

    update(table, fields, condition, timestamps = true) {
        return new Promise((resolve, reject) => {
            if (timestamps) {
                fields.updated_at = new Date;
            }

            let query = this.getClient().table(table).update(fields);
            if (typeof condition === 'function') {
                query = condition(query);
            }

            return query.catch(err => reject(err));
        });
    }
}

module.exports = Database;
