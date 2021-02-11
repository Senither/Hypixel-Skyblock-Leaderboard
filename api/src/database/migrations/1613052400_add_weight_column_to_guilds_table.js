/**
 * Run the migrations, adding weight column to the guilds table.
 *
 * @param  {Knex} knex  The Knex database instance
 * @return {Promise}
 */
exports.up = function (knex) {
  return Promise.all([
    knex.schema.table('guilds', table => {
      table.decimal('weight', 12).defaultTo(0).after('data')
      table.decimal('skill_weight', 12).defaultTo(0).after('weight')
      table.decimal('slayer_weight', 12).defaultTo(0).after('skill_weight')
      table.decimal('dungeon_weight', 12).defaultTo(0).after('slayer_weight')
    }),
    knex.schema.table('metrics', table => {
      table.decimal('weight', 12).defaultTo(0).after('guild_id')
      table.decimal('skill_weight', 12).defaultTo(0).after('weight')
      table.decimal('slayer_weight', 12).defaultTo(0).after('skill_weight')
      table.decimal('dungeon_weight', 12).defaultTo(0).after('slayer_weight')
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
      table.dropColumns(['weight', 'skill_weight', 'slayer_weight', 'dungeon_weight'])
    }),
    knex.schema.table('metrics', table => {
      table.dropColumns(['weight', 'skill_weight', 'slayer_weight', 'dungeon_weight'])
    }),
  ])
}
