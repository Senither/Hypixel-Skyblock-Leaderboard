'use strict'
process.title = 'Hypixel Skyblock Leaderboard Generator'

const app = require('./src/application')

app
  .bootstrap()
  .then(() => {
    return app.register()
  })
  .then(() => {
    return app.connect()
  })
  .catch(err => console.error(err))
