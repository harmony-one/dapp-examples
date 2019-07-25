import logger from 'morgan'
import path from 'path'
import bodyParser from 'body-parser'
import cors from 'cors'
import errorhandler from 'errorhandler'
import express from 'express'

import router from './router'

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '../../web/statics')))
// app.use(express.static(path.join(__dirname, '../../web/WebWallet/dist')))
app.use(cors())
app.use(logger('dev'))
app.use(errorhandler())
router(app)
export default app
