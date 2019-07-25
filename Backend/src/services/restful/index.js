import { getUsers, hello, getUser } from '../../resolvers'

export const restHello = async () => hello()
export const restUser = async req => {
  const { query } = req
  const id = query ? query.id : null
  const result = await getUser(id)

  return result || null
}

export const restGetUsers = async () => getUsers()
