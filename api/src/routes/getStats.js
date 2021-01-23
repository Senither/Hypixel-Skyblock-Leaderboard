const app = require('../application')
const config = require('../../config.json')

/**
 * The local in-memory cache object that
 * stores all of our cache entities.
 *
 * @type {Object}
 */
const cache = {}

/**
 * Gets the given entiry fingerprint from the in-memory cache if it exists,
 * otherwise it will use the callback function to retrive the value and
 * store it back into the cache.
 *
 * @param  {String}   fingerprint
 * @param  {Function} callback
 * @return {Integer}
 */
async function getCacheEntity(fingerprint, callback) {
  if (cache.hasOwnProperty(fingerprint)) {
    return cache[fingerprint]
  }

  const result = await callback()

  cache[fingerprint] = result.pop().total
  setTimeout(() => delete cache[fingerprint], 60000)

  return cache[fingerprint]
}

/**
 * Creates the SQL query that should be used to retrive the counter metrics.
 *
 * @param  {String} table
 * @param  {String} column
 * @return {Object}
 */
async function createCounterQuery(table, column) {
  return app.database.getClient().table(table).count({ total: column })
}

/**
 * Handles the request by retriving the metrics from the cache,
 * or querying the data from the database if it does
 * not exist in the cache.
 *
 * @param  {Object} request
 * @param  {Object} response
 * @return {Object}
 */
module.exports = async (request, response) => {
  response.json({
    status: 200,
    data: {
      guilds: await getCacheEntity('guilds', async () => {
        return [
          {
            total: Object.values(config.guilds).filter(guild => {
              return guild == null || !guild.hasOwnProperty('hidden')
            }).length,
          },
        ]
      }),
      guilds_metrics: await getCacheEntity('guildMetrics', async () => createCounterQuery('metrics', 'id')),
      players: await getCacheEntity('players', async () => createCounterQuery('players', 'uuid')),
      players_metrics: await getCacheEntity('playerMetrics', async () => createCounterQuery('player_metrics', 'id')),
    },
  })
}
