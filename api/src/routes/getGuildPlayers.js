const app = require('../application')
const weightCalculator = require('../utils/playerWeightCalculator')

module.exports = async (request, response) => {
  let guild = await app.database.getClient().select('id', 'name').from('guilds').where('uuid', request.params.id)

  if (guild.length == 0) {
    return response.json({
      status: 404,
      reason: 'Requested guild does not exist!',
    })
  }

  guild = guild.pop()

  let players = await app.database.getClient().from('players').where('guild_id', guild.id).orderBy('username')

  response.json({
    status: 200,
    data: players.map(player => {
      delete player.guild_id
      delete player.created_at
      delete player.updated_at

      player.weight = weightCalculator(player)

      return player
    }),
  })
}
