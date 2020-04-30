
const app = require('../application');

module.exports = async (request, response) => {
    let players = await app.database.getClient()
        .select(['guilds.name as guild_name', 'players.*'])
        .from('players')
        .leftJoin('guilds', function () {
            return this.on('players.guild_id', '=', 'guilds.id');
        });

    response.json({
        status: 200,
        data: players.map(player => {
            delete player.guild_id;
            delete player.created_at;
            delete player.updated_at;

            return player;
        })
    });
};
