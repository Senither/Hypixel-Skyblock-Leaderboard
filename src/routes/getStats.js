
const app = require('../application');

module.exports = async (request, response) => {
    let guilds = await app.database.getClient().table('guilds').count({ total: 'id' });
    let players = await app.database.getClient().table('players').count({ total: 'uuid' });

    response.json({
        status: 200,
        data: {
            guilds: guilds.pop().total,
            players: players.pop().total,
        }
    });
};
