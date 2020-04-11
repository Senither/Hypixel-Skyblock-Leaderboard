
/**
 * Run the migrations, creating the guilds table.
 *
 * @param  {Knex} knex  The Knex database instance
 * @return {Promise}
 */
exports.up = function (knex, Promise) {
    return knex.schema.createTable('guilds', table => {
        table.increments('id');
        table.string('uuid').unique();
        table.string('name').collate('utf8mb4_unicode_ci');
        table.text('data');
        table.decimal('average_skill').defaultTo(0);
        table.decimal('average_slayer').defaultTo(0);
        table.timestamps();
        table.datetime('last_updated_at').defaultTo('2001-01-01 01:01:01');

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
    return knex.schema.dropTable('guilds');
};
