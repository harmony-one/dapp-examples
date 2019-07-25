const program = require('commander')

program
  .version('1.0.0')
  .option('-t, --http', 'create http Server')
  .option('-s, --https', 'create https Server')
  .option('-p,--port <n>', 'define port', parseInt)
  .parse(process.argv)

const httpType = () => {
  if (program.http) {
    return 'http'
  }
  if (program.https) {
    return 'https'
  }
  return 'http'
}

const serverPort = () => {
  if (program.port) {
    return program.port
  }
  return false
}

module.exports = { httpType, serverPort }
