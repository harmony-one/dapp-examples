import restful from './restful'
import pages from './static'
// import graphql from './graphql'

const router = app => {
  app.use('/', pages)
  app.use('/api', restful)
  app.use((err, req, res) => {
    if (err.name === 'UnauthorizedError') {
      res.status(401).send({ err: 'invalid token...' })
    }
  })
}

export default router
