import http from 'http'

const onError = (error, port) => {
  if (error.syscall !== 'listen') {
    throw error
  }
  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`)
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`)
      process.exit(1)
      break
    default:
      throw error
  }
}

export const createServer = (config, app) => {
  const { httpType, port, options } = config
  let server
  server = http.createServer(app)

  server.listen(port, () => {
    console.log(`express ${httpType} is listening on ${port}`)
  })
  server.on('error', err => onError(err, port))
}
