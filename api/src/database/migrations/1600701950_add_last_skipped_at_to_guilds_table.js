/**
 * Run the migrations, adding slayer XP columns to the players table.
 *
 * @param  {Knex} knex  The Knex database instance
 * @return {Promise}
 */
exports.up = function (knex) {
  return knex.schema.table('guilds', table => {
    table.datetime('last_skipped_at').defaultTo(null).after('last_updated_at')
  })
}

/**
 * Reverse the migrations.
 *
 * @param  {Knex} knex  The Knex database instance
 * @return {Promise}
 */
exports.down = function (knex) {
  return knex.schema.table('guilds', table => {
    table.dropColumn('last_skipped_at')
  })
}
