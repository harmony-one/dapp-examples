import {
  restHello,
  restUser,
  restGetUsers,
  getContracts,
  compileContract,
  getSol,
  currentUser,
  saveDeployed,
  getDeployed
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
    name: '/currentUser',
    exec: currentUser
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
  },
  {
    method: 'get',
    name: '/saveDeployed',
    exec: saveDeployed
  },
  {
    method: 'get',
    name: '/getDeployed',
    exec: getDeployed
  }
]

const routes = restfulGenerator(routerTable)

export default routes
