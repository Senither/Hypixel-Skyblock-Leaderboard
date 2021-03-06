const app = require('../application')
const weightCalculator = require('../utils/guildWeightCalculator')

const metricTypes = [
  'weight',
  'skill_weight',
  'slayer_weight',
  'dungeon_weight',
  'average_skill',
  'average_skill_progress',
  'average_slayer',
  'average_catacomb',
]

module.exports = async (request, response) => {
  let guild = await app.database.getClient().select('id', 'name').from('guilds').where('uuid', request.params.id)

  if (guild.length == 0) {
    return response.json({
      status: 404,
      reason: 'Requested guild does not exist!',
    })
  }

  guild = guild.pop()

  let metrics = await app.database
    .getClient()
    .select(metricTypes.concat(['members', 'created_at']))
    .from('metrics')
    .where('guild_id', guild.id)
    .orderBy('created_at', 'desc')

  response.json({
    status: 200,
    data: metrics.map(metric => {
      for (let type of metricTypes) {
        if (metric[type] <= 0) {
          metric[type] = null
        }
      }

      metric.weight = weightCalculator(metric)

      return metric
    }),
  })
}
