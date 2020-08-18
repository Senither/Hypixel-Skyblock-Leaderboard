
const app = require('../application');

module.exports = async (request, response) => {
    let query = app.database.getClient()
        .select(['guilds.name as guild_name', 'players.*'])
        .from('players')
        .leftJoin('guilds', function () {
            return this.on('players.guild_id', '=', 'guilds.id');
        })
        .havingRaw('guilds.name IS NOT ?', [null]);

    const username = request.query.username;
    if (username != null && username != undefined) {
        query.where('username', 'like', `%${username}%`);
    }

    players = await query;

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
