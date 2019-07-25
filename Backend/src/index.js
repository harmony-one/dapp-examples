import express from 'express'
import app from './app'
import { httpType, serverPort } from '../devOps/serverType'
import { serverConfig } from '../devOps/serverConfig'
import { createServer } from './utils/createServer'

const hType = httpType()
const sPort = serverPort()

if (module.hot) {
  module.hot.accept(['./app'], () => {
    console.log('🔁  HMR Reloading `./app`...')
  })
  console.info('✅  Server-side HMR Enabled!')
} else {
  console.info('❌  Server-side HMR Not Supported.')
}
const server = express()

server.use((err, req, res) => app.handle(err, req, res))

createServer(serverConfig(hType, sPort), server)

export default server
