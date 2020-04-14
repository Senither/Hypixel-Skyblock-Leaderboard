
const app = require('../application');

module.exports = async (request, response) => {
    let guild = await app.database.getClient()
        .select('id', 'name')
        .from('guilds')
        .where('uuid', request.params.id);

    if (guild.length == 0) {
        return response.json({
            status: 404,
            reason: 'Requested guild does not exist!'
        });
    }

    guild = guild.pop();

    let players = await app.database.getClient()
        .select(
            'uuid', 'username',
            'average_skill', 'total_slayer',
            'mining', 'foraging',
            'enchanting', 'farming',
            'combat', 'fishing',
            'alchemy', 'carpentry',
            'runecrafting', 'last_updated_at'
        )
        .from('players')
        .where('guild_id', guild.id)
        .orderBy('username');

    response.json({
        status: 200,
        data: players
    });
};
