import { getUsers, hello, getUser } from '../../resolvers'
import {
  getContracts,
  complileWithPath,
  getContractCode,
  saveDeployed as saveToLocal,
  getDeployed as getLocalDeployed,
  setDefaultContractLocal,
  readDefaultContractLocal
} from '../../resolvers/contract'

export const restHello = async () => hello()
export const restUser = async req => {
  const { query } = req
  const id = query ? query.id : null
  const result = await getUser(id)

  return result || null
}

export const currentUser = async () => {
  return {
    name: 'Serati Ma',
    avatar:
      'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    userid: '00000001',
    email: 'antdesign@alipay.com',
    signature: '海纳百川，有容乃大',
    title: '交互专家',
    group: '蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED',
    tags: [
      {
        key: '0',
        label: '很有想法的'
      },
      {
        key: '1',
        label: '专注设计'
      },
      {
        key: '2',
        label: '辣~'
      },
      {
        key: '3',
        label: '大长腿'
      },
      {
        key: '4',
        label: '川妹子'
      },
      {
        key: '5',
        label: '海纳百川'
      }
    ],
    notifyCount: 12,
    unreadCount: 11,
    country: 'China',
    geographic: {
      province: {
        label: '浙江省',
        key: '330000'
      },
      city: {
        label: '杭州市',
        key: '330100'
      }
    },
    address: '西湖区工专路 77 号',
    phone: '0752-268888888'
  }
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

export const saveDeployed = async (req, res) => {
  const { query } = req
  const { name, payload } = query
  if (name !== null && payload !== null) {
    const result = await saveToLocal(name, JSON.parse(payload))
    return result
  }
  return null
}

export const getDeployed = async (req, res) => {
  const { query } = req
  const { name, payload } = query
  if (name !== null) {
    const result = await getLocalDeployed(name)
    return result
  }
  return null
}

export const setDefaultContract = async (req, res) => {
  const { query } = req
  const { name, address } = query
  if (name !== null && address !== null) {
    const result = await setDefaultContractLocal(name, address)
    return result
  }
  return null
}

export const readDefaultContract = async (req, res) => {
  const { query } = req
  const { name } = query
  if (name !== null) {
    const result = await readDefaultContractLocal(name)
    return result
  }
  return null
}

export { getContracts }
