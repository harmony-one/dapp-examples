import express from 'express'
import path from 'path'

const router = express.Router()

export default routerList =>
  routerList.map(page => {
    return router.get(page.url, (req, res) => {
      res.sendFile(
        path.join(__dirname, '../../../../web', page.path, 'index.html')
      )
    })
  })
