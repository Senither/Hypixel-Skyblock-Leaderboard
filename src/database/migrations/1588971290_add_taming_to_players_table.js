
/**
 * Run the migrations, adding slayer XP columns to the players table.
 *
 * @param  {Knex} knex  The Knex database instance
 * @return {Promise}
 */
exports.up = function (knex) {
    return knex.schema.table('players', table => {
        table.decimal('taming', 8)
             .defaultTo(0)
             .after('alchemy_xp');
        table.decimal('taming_xp', 12)
             .defaultTo(0)
             .after('taming');
    });
};

/**
 * Reverse the migrations.
 *
 * @param  {Knex} knex  The Knex database instance
 * @return {Promise}
 */
exports.down = function (knex) {
    return knex.schema.table('players', table => {
        table.dropColumns(['taming', 'taming_xp']);
    });
};
