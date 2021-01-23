/**
 * Run the migrations, creating the metrics table.
 *
 * @param  {Knex} knex  The Knex database instance
 * @return {Promise}
 */
exports.up = function (knex, Promise) {
  return knex.schema.createTable('metrics', table => {
    table.increments('id')
    table.bigInteger('guild_id').index()
    table.decimal('average_skill').defaultTo(0)
    table.decimal('average_slayer', 12).defaultTo(0)
    table.integer('members').defaultTo(0)
    table.timestamps()

    table.collate('utf8_unicode_ci')
  })
}

/**
 * Reverse the migrations.
 *
 * @param  {Knex} knex  The Knex database instance
 * @return {Promise}
 */
exports.down = function (knex, Promise) {
  return knex.schema.dropTable('metrics')
}
