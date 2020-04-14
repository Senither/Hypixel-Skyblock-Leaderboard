
/**
 * Run the migrations, adding skills columsn to the players table.
 *
 * @param  {Knex} knex  The Knex database instance
 * @return {Promise}
 */
exports.up = function (knex, Promise) {
    return knex.schema.table('players', table => {
        table.decimal('mining')
             .defaultTo(0)
             .after('total_slayer');
        table.decimal('foraging')
             .defaultTo(0)
             .after('mining');
        table.decimal('enchanting')
             .defaultTo(0)
             .after('foraging');
        table.decimal('farming')
             .defaultTo(0)
             .after('enchanting');
        table.decimal('combat')
             .defaultTo(0)
             .after('farming');
        table.decimal('fishing')
             .defaultTo(0)
             .after('combat');
        table.decimal('alchemy')
             .defaultTo(0)
             .after('fishing');
        table.decimal('carpentry')
             .defaultTo(0)
             .after('alchemy');
        table.decimal('runecrafting')
             .defaultTo(0)
             .after('carpentry');
    });
};

/**
 * Reverse the migrations.
 *
 * @param  {Knex} knex  The Knex database instance
 * @return {Promise}
 */
exports.down = function (knex, Promise) {
    return knex.schema.table('players', table => {
        table.dropColumns([
            'mining', 'foraging',
            'enchanting', 'farming',
            'combat', 'fishing',
            'alchemy', 'carpentry',
            'runecrafting'
        ]);
    });
};
