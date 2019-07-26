import {
  restHello,
  restUser,
  restGetUsers,
  getContracts,
  compileContract,
  getSol
} from '../services/restful'
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
  },
  {
    method: 'get',
    name: '/getContracts',
    exec: getContracts
  },
  {
    method: 'get',
    name: '/compileContract',
    exec: compileContract
  },
  {
    method: 'get',
    name: '/getSol',
    exec: getSol
  }
]

const routes = restfulGenerator(routerTable)

export default routes
