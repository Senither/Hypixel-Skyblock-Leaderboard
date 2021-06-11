/**
 * Run the migrations, adding enderman weight column to the player tables.
 *
 * @param  {Knex} knex  The Knex database instance
 * @return {Promise}
 */
exports.up = function (knex) {
  return Promise.all([
    knex.schema.table('players', table => {
      table.decimal('enderman_xp', 12).defaultTo(0).after('sven_xp')
    }),
    knex.schema.table('player_metrics', table => {
      table.decimal('enderman_xp', 12).defaultTo(0).after('sven_xp')
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
    knex.schema.table('guilds', table => {
      table.dropColumns('enderman_xp')
    }),
    knex.schema.table('metrics', table => {
      table.dropColumns('enderman_xp')
    }),
  ])
}
