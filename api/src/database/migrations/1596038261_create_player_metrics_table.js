
/**
 * Run the migrations, creating the player metrics table.
 *
 * @param  {Knex} knex  The Knex database instance
 * @return {Promise}
 */
exports.up = function (knex, Promise) {
    return knex.schema.createTable('player_metrics', table => {
        table.increments('id');
        table.string('uuid', 36).index();
        table.decimal('average_skill').defaultTo(0);
        table.decimal('average_skill_progress').defaultTo(0);
        table.decimal('mining').defaultTo(0);
        table.decimal('mining_xp', 12).defaultTo(0);
        table.decimal('foraging').defaultTo(0);
        table.decimal('foraging_xp', 12).defaultTo(0);
        table.decimal('enchanting').defaultTo(0);
        table.decimal('enchanting_xp', 12).defaultTo(0);
        table.decimal('farming').defaultTo(0);
        table.decimal('farming_xp', 12).defaultTo(0);
        table.decimal('combat').defaultTo(0);
        table.decimal('combat_xp', 12).defaultTo(0);
        table.decimal('fishing').defaultTo(0);
        table.decimal('fishing_xp', 12).defaultTo(0);
        table.decimal('alchemy').defaultTo(0);
        table.decimal('alchemy_xp', 12).defaultTo(0);
        table.decimal('taming').defaultTo(0);
        table.decimal('taming_xp', 12).defaultTo(0);
        table.decimal('carpentry').defaultTo(0);
        table.decimal('carpentry_xp', 12).defaultTo(0);
        table.decimal('runecrafting').defaultTo(0);
        table.decimal('runecrafting_xp', 12).defaultTo(0);
        table.bigInteger('total_slayer').defaultTo(0);
        table.decimal('revenant_xp', 12).defaultTo(0);
        table.decimal('tarantula_xp', 12).defaultTo(0);
        table.decimal('sven_xp', 12).defaultTo(0);
        table.timestamps();

        table.collate('utf8_unicode_ci');
    });
};

/**
 * Reverse the migrations.
 *
 * @param  {Knex} knex  The Knex database instance
 * @return {Promise}
 */
exports.down = function (knex, Promise) {
    return knex.schema.dropTable('player_metrics');
};
