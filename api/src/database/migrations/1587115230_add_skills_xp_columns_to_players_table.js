/**
 * Run the migrations, adding skills XP columns to the players table.
 *
 * @param  {Knex} knex  The Knex database instance
 * @return {Promise}
 */
exports.up = function (knex, Promise) {
  return knex.schema.table('players', table => {
    table.decimal('mining_xp', 12).defaultTo(0).after('mining')
    table.decimal('foraging_xp', 12).defaultTo(0).after('foraging')
    table.decimal('enchanting_xp', 12).defaultTo(0).after('enchanting')
    table.decimal('farming_xp', 12).defaultTo(0).after('farming')
    table.decimal('combat_xp', 12).defaultTo(0).after('combat')
    table.decimal('fishing_xp', 12).defaultTo(0).after('fishing')
    table.decimal('alchemy_xp', 12).defaultTo(0).after('alchemy')
    table.decimal('carpentry_xp', 12).defaultTo(0).after('carpentry')
    table.decimal('runecrafting_xp', 12).defaultTo(0).after('runecrafting')
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
    table.dropColumns([
      'mining_xp',
      'foraging_xp',
      'enchanting_xp',
      'farming_xp',
      'combat_xp',
      'fishing_xp',
      'alchemy_xp',
      'carpentry_xp',
      'runecrafting_xp',
    ])
  })
}
