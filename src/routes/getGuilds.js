
const app = require('../application');

module.exports = async (request, response) => {
    let guilds = await app.database.getClient()
        .select('uuid as id', 'name', 'average_skill', 'average_slayer', 'members', 'last_updated_at')
        .from('guilds')
        .orderBy('name');

    response.json({
        status: 200,
        data: guilds
    });
};
