const app = require('./app')
const http = require('http')
const config = require('./helpers/config')
const logger = require('./helpers/logger')

const server = http.createServer(app)

server.listen(config.PORT, () => {
  logger.info(`Server backend running on port ${config.PORT}`)
})
