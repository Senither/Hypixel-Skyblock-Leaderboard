/**
 * Run the migrations, creating the history table.
 *
 * @param  {Knex} knex  The Knex database instance
 * @return {Promise}
 */
exports.up = function (knex, Promise) {
  return knex.schema.createTable('history', table => {
    table.increments('id')
    table.bigInteger('guild_id')
    table.integer('type')
    table.string('uuid', 64)
    table.string('username', 32)
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
  return knex.schema.dropTable('history')
}
