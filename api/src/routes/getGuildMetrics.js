
const app = require('../application');
const weightCalculator = require('../utils/weightCalculator');

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

    let metrics = await app.database.getClient()
        .select(
            'average_skill',
            'average_skill_progress',
            'average_slayer',
            'average_catacomb',
            'members',
            'created_at'
        )
        .from('metrics')
        .where('guild_id', guild.id)
        .orderBy('created_at', 'desc');

    response.json({
        status: 200,
        data: metrics.map(metric => {
            metric.weight = weightCalculator(metric);

            return metric;
        })
    });
};
