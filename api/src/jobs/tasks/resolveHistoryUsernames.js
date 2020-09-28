
const Task = require('../task');

class resolveHistoryUsernames extends Task {
    constructor() {
        super();
    }

    interval() {
        return 10 * 1000;
    }

    async run(app) {
        let user = await app.database.getClient()
            .table('history')
            .select('uuid')
            .whereNull('username')
            .first();

        if (user == null || user == undefined) {
            return;
        }

        try {
            console.log(`Resolving ${user.uuid} username for the history`);

            let response = await app.http.get(`player/${user.uuid}`);

            await app.database.getClient()
                .table('history')
                .where('uuid', user.uuid)
                .update({ username: response.data.data.username });
        } catch (e) {
            console.log(`Failed to resolve player username for ${user.uuid}: `, e);
        }
    }
}

module.exports = resolveHistoryUsernames;