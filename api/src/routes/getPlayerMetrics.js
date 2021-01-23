const app = require('../application')

module.exports = async (request, response) => {
  let metric = await app.database
    .getClient()
    .from('player_metrics')
    .where('uuid', request.params.id)
    .orderBy('created_at', 'desc')

  if (metric.length == 0) {
    return response.json({
      status: 404,
      reason: 'Requested player does not exist, or has no metric data stored!',
    })
  }

  response.json({
    status: 200,
    data: metric,
  })
}
