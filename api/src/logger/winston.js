const { createLogger, format, transports } = require('winston')
const { combine, timestamp, printf } = format

class WinstonLogger {
  constructor() {
    this.winston = createLogger({
      level: 'info',
      format: combine(
        format.colorize(),
        timestamp(),
        printf(({ level, message, timestamp }) => {
          let parts = timestamp.toString().split('T')
          let time = parts[1].substr(0, parts[1].length - 5)

          return `[${parts[0]} ${time}] [ ${level} ]: ${message}`
        })
      ),
      transports: [
        new transports.Console(),
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/leaderboard.log' }),
      ],
    })
  }

  info(...args) {
    return this.winston.info(...args)
  }

  warn(...args) {
    return this.winston.warn(...args)
  }

  error(...args) {
    return this.winston.error(...args)
  }

  debug(...args) {
    return this.winston.debug(...args)
  }

  log(...args) {
    return this.winston.log(...args)
  }

  getLogger() {
    return this.winston
  }
}

module.exports = new WinstonLogger()
