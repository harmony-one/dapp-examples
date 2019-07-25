import express from 'express'

const router = express.Router()

export default routerList =>
  routerList.map(routes => {
    if (routes.method === 'get') {
      return router.get(routes.name, async (req, res) => {
        const getResult = await routes.exec(req, res)
        res.send(getResult).end()
      })
    } else if (routes.method === 'post') {
      return router.post(routes.name, async (req, res) => {
        const postResult = await routes.exec(req, res)
        res.send(postResult).end()
      })
    }
    return false
  })
