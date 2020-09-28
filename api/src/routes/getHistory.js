
const app = require('../application');

function has(request, name) {
    let prop = request.query[name];
    return prop != null && prop != undefined;
}

async function paginateResponse(request, query) {
    let perPage = parseInt(request.query.perPage);
    let page = 1;

    let totalQuery = app.database.getClient()
        .select(['history.id', 'guilds.uuid as guild_id'])
        .from('history')
        .leftJoin('guilds', function () {
            return this.on('history.guild_id', '=', 'guilds.id');
        })
        .count({ total: 'history.id' });

    if (has(request, 'guild_id')) {
        totalQuery.where('guilds.uuid', '=', request.query.guild_id);
    }

    let totalEntities = (await totalQuery)[0].total;
    let lastPage = Math.ceil(totalEntities / perPage);

    query.limit(perPage);

    if (has(request, 'page')) {
        page = Math.max((parseInt(request.query.page) - 1), 0) + 1;
        page = Math.min(page, lastPage);

        query.offset((Math.max(page, 1) - 1) * perPage);
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
        .select([
            'history.id',
            'history.uuid',
            'history.username',
            'guilds.uuid as guild_id',
            'guilds.name as guild_name',
            'history.type',
            'history.created_at'
        ])
        .from('history')
        .leftJoin('guilds', function () {
            return this.on('history.guild_id', '=', 'guilds.id');
        })
        .orderBy('id', 'desc');

    if (has(request, 'guild_id')) {
        query.where('guilds.uuid', '=', request.query.guild_id);
    } else if (has(request, 'uuid')) {
        query.where('history.uuid', '=', request.query.uuid);
    }

    let paginate = null;
    if (has(request, 'perPage')) {
        paginate = await paginateResponse(request, query);
    }

    let jsonResponse = {
        status: 200,
        data: await query,
    };

    if (paginate != null) {
        jsonResponse.paginate = paginate;
    }

    response.json(jsonResponse);
};
