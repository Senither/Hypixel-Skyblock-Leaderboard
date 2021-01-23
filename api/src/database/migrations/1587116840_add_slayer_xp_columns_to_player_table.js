/**
 * Run the migrations, adding slayer XP columns to the players table.
 *
 * @param  {Knex} knex  The Knex database instance
 * @return {Promise}
 */
exports.up = function (knex, Promise) {
  return knex.schema.table('players', table => {
    table.decimal('revenant_xp', 12).defaultTo(0).after('total_slayer')
    table.decimal('tarantula_xp', 12).defaultTo(0).after('revenant_xp')
    table.decimal('sven_xp', 12).defaultTo(0).after('tarantula_xp')
  })
}

/**
 * Reverse the migrations.
 *
 * @param  {Knex} knex  The Knex database instance
 * @return {Promise}
 */
exports.down = function (knex, Promise) {
  return knex.schema.table('players', table => {
    table.dropColumns(['revenant_xp', 'tarantula_xp', 'sven_xp'])
  })
}
