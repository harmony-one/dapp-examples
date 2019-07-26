import { getUsers, hello, getUser } from '../../resolvers'
import {
  getContracts,
  complileWithPath,
  getContractCode
} from '../../resolvers/contract'

export const restHello = async () => hello()
export const restUser = async req => {
  const { query } = req
  const id = query ? query.id : null
  const result = await getUser(id)

  return result || null
}

export const restGetUsers = async () => getUsers()

/// contracts

export const compileContract = async req => {
  const { query } = req
  const name = query ? query.name : null
  if (name !== null) {
    const constracts = await getContracts()
    const found = constracts.find(c => name === Object.keys(c)[0])
    if (found[name].path) {
      const result = await complileWithPath(found[name].path)
      return result
    } else {
      return null
    }
  }
  return null
}

export const getSol = async req => {
  const { query } = req
  const name = query ? query.name : null
  if (name !== null) {
    const result = await getContractCode(name)
    return result
  }
  return null
}

export { getContracts }
