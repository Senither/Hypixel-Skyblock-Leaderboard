/**
 * Run the migrations, adding slayer XP columns to the players table.
 *
 * @param  {Knex} knex  The Knex database instance
 * @return {Promise}
 */
exports.up = function (knex) {
  return Promise.all([
    knex.schema.table('guilds', table => {
      table.decimal('average_catacomb').defaultTo(0).after('average_slayer')
    }),
    knex.schema.table('metrics', table => {
      table.decimal('average_catacomb').defaultTo(0).after('average_slayer')
    }),
    knex.schema.table('players', table => {
      table.decimal('catacomb').defaultTo(0).after('average_skill_progress')
      table.decimal('catacomb_xp', 12).defaultTo(0).after('catacomb')
      table.decimal('healer').defaultTo(0).after('catacomb_xp')
      table.decimal('healer_xp', 12).defaultTo(0).after('healer')
      table.decimal('mage').defaultTo(0).after('healer_xp')
      table.decimal('mage_xp', 12).defaultTo(0).after('mage')
      table.decimal('berserk').defaultTo(0).after('mage_xp')
      table.decimal('berserk_xp', 12).defaultTo(0).after('berserk')
      table.decimal('archer').defaultTo(0).after('berserk_xp')
      table.decimal('archer_xp', 12).defaultTo(0).after('archer')
      table.decimal('tank').defaultTo(0).after('archer_xp')
      table.decimal('tank_xp', 12).defaultTo(0).after('tank')
    }),
    knex.schema.table('player_metrics', table => {
      table.decimal('catacomb').defaultTo(0).after('average_skill_progress')
      table.decimal('catacomb_xp', 12).defaultTo(0).after('catacomb')
      table.decimal('healer').defaultTo(0).after('catacomb_xp')
      table.decimal('healer_xp', 12).defaultTo(0).after('healer')
      table.decimal('mage').defaultTo(0).after('healer_xp')
      table.decimal('mage_xp', 12).defaultTo(0).after('mage')
      table.decimal('berserk').defaultTo(0).after('mage_xp')
      table.decimal('berserk_xp', 12).defaultTo(0).after('berserk')
      table.decimal('archer').defaultTo(0).after('berserk_xp')
      table.decimal('archer_xp', 12).defaultTo(0).after('archer')
      table.decimal('tank').defaultTo(0).after('archer_xp')
      table.decimal('tank_xp', 12).defaultTo(0).after('tank')
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
      table.dropColumn('average_catacomb')
    }),
    knex.schema.table('metrics', table => {
      table.dropColumn('average_catacomb')
    }),
    knex.schema.table('players', table => {
      table.dropColumns([
        'catacomb',
        'catacomb_xp',
        'healer',
        'healer_xp',
        'mage',
        'mage_xp',
        'berserk',
        'berserk_xp',
        'archer',
        'archer_xp',
        'tank',
        'tank_xp',
      ])
    }),
    knex.schema.table('player_metrics', table => {
      table.dropColumns([
        'catacomb',
        'catacomb_xp',
        'healer',
        'healer_xp',
        'mage',
        'mage_xp',
        'berserk',
        'berserk_xp',
        'archer',
        'archer_xp',
        'tank',
        'tank_xp',
      ])
    }),
  ])
}
