const app = require('../application')
const config = require('../../config.json')
const weightCalculator = require('../utils/guildWeightCalculator')

module.exports = async (request, response) => {
  let guilds = await app.database
    .getClient()
    .select(
      'uuid as id',
      'name',
      'weight',
      'skill_weight',
      'slayer_weight',
      'dungeon_weight',
      'average_skill',
      'average_skill_progress',
      'average_slayer',
      'average_catacomb',
      'members',
      'last_updated_at',
      'last_skipped_at'
    )
    .from('guilds')
    .orderBy('name')

  response.json({
    status: 200,
    data: guilds.map(guild => {
      guild.weight = weightCalculator(guild)
      guild.meta = config.guilds[guild.id] != null ? config.guilds[guild.id] : {}

      return guild
    }),
  })
}
