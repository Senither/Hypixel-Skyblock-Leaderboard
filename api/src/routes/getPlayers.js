
const app = require('../application');

const sortableColumns = [
    'average_skill',
    'average_skill_progress',
    'catacomb',
    'catacomb_xp',
    'healer',
    'healer_xp',
    'mage',
    'mage_xp',
    'berserk',
    'berserk_xp',
    'archer',
    'archer_xp',
    'tank',
    'tank_xp',
    'total_slayer',
    'revenant_xp',
    'tarantula_xp',
    'sven_xp',
    'mining',
    'mining_xp',
    'foraging',
    'foraging_xp',
    'enchanting',
    'enchanting_xp',
    'farming',
    'farming_xp',
    'combat',
    'combat_xp',
    'fishing',
    'fishing_xp',
    'alchemy',
    'alchemy_xp',
    'taming',
    'taming_xp',
    'carpentry',
    'carpentry_xp',
    'runecrafting',
    'runecrafting_xp'
];

function has(request, name) {
    let prop = request.query[name];
    return prop != null && prop != undefined;
}

async function paginateResponse(request, query) {
    let perPage = parseInt(request.query.perPage);
    let page = 1;

    let total = await app.database.getClient()
        .select(['guilds.name as guild_name', 'players.guild_id', 'players.uuid'])
        .from('players')
        .leftJoin('guilds', function () {
            return this.on('players.guild_id', '=', 'guilds.id');
        })
        .havingRaw('guilds.name IS NOT ?', [null])
        .count({ total: 'players.uuid' });
    let totalEntities = total[0].total;
    let lastPage = Math.ceil(totalEntities / perPage);

    query.limit(perPage);

    if (has(request, 'page')) {
        page = Math.max((parseInt(request.query.page) - 1), 0) + 1;
        page = Math.min(page, lastPage);

        query.offset((page - 1) * perPage);
    }

    return {
        current_page: page,
        last_page: lastPage,
        per_page: perPage,
        total: totalEntities,
    };
}

module.exports = async (request, response) => {
    let query = app.database.getClient()
        .select(['guilds.name as guild_name', 'players.*'])
        .from('players')
        .leftJoin('guilds', function () {
            return this.on('players.guild_id', '=', 'guilds.id');
        })
        .havingRaw('guilds.name IS NOT ?', [null]);

    if (has(request, 'uuid')) {
        query.where('players.uuid', '=', request.query.uuid);
    }

    if (has(request, 'username')) {
        query.where('username', 'like', `%${request.query.username}%`);
    }

    if (has(request, 'sort') && sortableColumns.includes(request.query.sort)) {
        query.orderBy(request.query.sort, 'desc');
    }

    let paginate = null;
    if (has(request, 'perPage')) {
        paginate = await paginateResponse(request, query);
    }

    let jsonResponse = {
        status: 200,
        data: (await query).map(player => {
            delete player.guild_id;
            delete player.created_at;
            delete player.updated_at;

            return player;
        })
    };

    if (paginate != null) {
        jsonResponse.paginate = paginate;
    }

    response.json(jsonResponse);
};
