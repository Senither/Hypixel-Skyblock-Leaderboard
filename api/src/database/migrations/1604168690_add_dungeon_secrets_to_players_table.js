/**
 * Run the migrations, adding slayer XP columns to the players table.
 *
 * @param  {Knex} knex  The Knex database instance
 * @return {Promise}
 */
exports.up = function (knex) {
  return Promise.all([
    knex.schema.table('players', table => {
      table.integer('secrets_found').defaultTo(0).after('catacomb_xp')
    }),
    knex.schema.table('player_metrics', table => {
      table.integer('secrets_found').defaultTo(0).after('catacomb_xp')
    }),
  ])
}

/**
 * Reverse the migrations.
 *
 * @param  {Knex} knex  The Knex database instance
 * @return {Promise}
 */
exports.down = function (knex) {
  return Promise.all([
    knex.schema.table('players', table => {
      table.dropColumn('secrets_found')
    }),
    knex.schema.table('player_metrics', table => {
      table.dropColumn('secrets_found')
    }),
  ])
}
