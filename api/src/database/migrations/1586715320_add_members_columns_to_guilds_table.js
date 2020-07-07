
/**
 * Run the migrations, creating the guilds table.
 *
 * @param  {Knex} knex  The Knex database instance
 * @return {Promise}
 */
exports.up = function (knex, Promise) {
    return knex.schema.table('guilds', table => {
        table.integer('members')
             .defaultTo(0)
             .after('average_slayer');
    });
};

/**
 * Reverse the migrations.
 *
 * @param  {Knex} knex  The Knex database instance
 * @return {Promise}
 */
exports.down = function (knex, Promise) {
    return knex.schema.table('guilds', table => {
        table.dropColumn('members');
    });
};
