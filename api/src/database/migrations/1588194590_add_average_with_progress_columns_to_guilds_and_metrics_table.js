
/**
 * Run the migrations, adding slayer XP columns to the players table.
 *
 * @param  {Knex} knex  The Knex database instance
 * @return {Promise}
 */
exports.up = function (knex) {
    return Promise.all([
        knex.schema.table('guilds', table => {
            table.decimal('average_skill_progress')
                 .defaultTo(0)
                 .after('average_skill');
        }),
        knex.schema.table('metrics', table => {
            table.decimal('average_skill_progress')
                 .defaultTo(0)
                 .after('average_skill');
        }),
        knex.schema.table('players', table => {
            table.decimal('average_skill_progress')
                 .defaultTo(0)
                 .after('average_skill');
        })
    ]);
};

/**
 * Reverse the migrations.
 *
 * @param  {Knex} knex  The Knex database instance
 * @return {Promise}
 */
exports.down = function (knex) {
    return Promise.all([
        knex.schema.table('guilds', table => {
            table.dropColumn('average_skill_progress');
        }),
        knex.schema.table('metrics', table => {
            table.dropColumn('average_skill_progress');
        }),
        knex.schema.table('players', table => {
            table.dropColumn('average_skill_progress');
        })
    ]);
};
