const Task = require('../task')
const Logger = require('../../logger/winston')

class CleanupMetrics extends Task {
  constructor() {
    super()
  }

  interval() {
    return 60 * 10 * 1000
  }

  async run(app) {
    Promise.all([this.createCleanupQuery(app, 'metrics'), this.createCleanupQuery(app, 'player_metrics')])
      .then(() => {
        Logger.info('> Metrics have been cleaned up')
      })
      .catch(error => Logger.error(error))
  }

  createCleanupQuery(app, table) {
    return app.database.getClient().table(table).whereRaw('created_at < NOW() - INTERVAL 90 DAY').del()
  }
}

module.exports = CleanupMetrics
