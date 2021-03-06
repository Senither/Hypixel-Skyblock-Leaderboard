const Task = require('../task')
const Logger = require('../../logger/winston')

class resolveHistoryUsernames extends Task {
  constructor() {
    super()
  }

  interval() {
    return 10 * 1000
  }

  async run(app) {
    let user = await app.database.getClient().table('history').select('uuid').whereNull('username').first()

    if (user == null || user == undefined) {
      return
    }

    try {
      Logger.info(`Resolving ${user.uuid} username for the history`)

      let response = await app.http.get(`username?uuid=${user.uuid}`)
      let content = response.data.data

      await app.database
        .getClient()
        .table('history')
        .where('uuid', user.uuid)
        .update({
          username: content.hasOwnProperty(user.uuid) ? content[user.uuid] : '*Unknown*',
        })
    } catch (e) {
      Logger.info(`Failed to resolve player username for ${user.uuid}: `, e)
    }
  }
}

module.exports = resolveHistoryUsernames
