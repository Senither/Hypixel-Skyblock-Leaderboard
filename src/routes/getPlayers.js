
const app = require('../application');

module.exports = async (request, response) => {
    let players = await app.database.getClient().from('players').orderBy('username');

    response.json({
        status: 200,
        data: players.map(player => {
            delete player.created_at;
            delete player.updated_at;

            return player;
        })
    });
};
