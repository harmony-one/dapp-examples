import { restHello, restUser, restGetUsers } from '../services/restful'
import restfulGenerator from '../utils/restfulGenerator'

const routerTable = [
  {
    method: 'get',
    name: '/hello',
    exec: restHello
  },
  {
    method: 'get',
    name: '/user',
    exec: restUser
  },
  {
    method: 'get',
    name: '/getUsers',
    exec: restGetUsers
  }
]

const routes = restfulGenerator(routerTable)

export default routes
