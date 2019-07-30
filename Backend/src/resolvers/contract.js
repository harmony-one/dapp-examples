import fs from 'fs'
import path from 'path'
import { compileContract } from './compile'

const contractsFolder = 'contracts'
const dirs = fs.readdirSync(path.join(__dirname, '../../', contractsFolder))

const contracts = []

for (const folder of dirs) {
  const contractName = folder
  const path = `${contractsFolder}/${folder}/${contractName}.sol`
  const obj = {}
  obj[folder] = { path: path }
  contracts.push(obj)
}

export const complileWithPath = async filePath => {
  const json = filePath.replace('.sol', '.json')
  const { abi, bin } = compileContract(filePath, json)
  return { abi, bin }
}

export const getContracts = async () => {
  return contracts
}

export const getContractCode = async name => {
  const contracts = await getContracts()
  const found = contracts.find(c => {
    return name === Object.keys(c)[0]
  })
  if (found) {
    const filePath = path.join(__dirname, '../../', found[name].path)
    return fs.readFileSync(filePath, { encoding: 'utf8' })
  }
  return ''
}

export const saveDeployed = async (name, payload) => {
  const contracts = await getContracts()
  const found = contracts.find(c => {
    return name === Object.keys(c)[0]
  })
  if (found) {
    const toSave = `${found[name].path.replace('.sol', '')}-${
      payload.address
    }.json`
    const filePath = path.join(__dirname, '../../', toSave)
    return fs.writeFileSync(filePath, JSON.stringify(payload))
  }
  return ''
}

export const getDeployed = async name => {
  const contracts = await getContracts()
  const found = contracts.find(c => {
    return name === Object.keys(c)[0]
  })
  if (found) {
    const toGrab = `${found[name].path.replace(`${name}.sol`, '')}`
    const fsArray = fs.readdirSync(path.join(__dirname, '../../', toGrab))
    const exactArray = fsArray.filter(
      val =>
        !!val
          .replace(`${name}`, '')
          .replace(`.json`, '')
          .replace(`.sol`, '')
          .replace('-', '')
          .replace('0x', '')
          .match(`^[0-9a-fA-F]{40}$`)
    )
    const result = []
    exactArray.forEach(val => {
      const filePath = path.join(__dirname, '../../', toGrab, val)
      const content = fs.readFileSync(filePath, { encoding: 'utf8' })
      result.push(JSON.parse(content))
    })
    return result
  }
  return ''
}

export const setDefaultContractLocal = async (name, address) => {
  const contracts = await getContracts()
  const found = contracts.find(c => {
    return name === Object.keys(c)[0]
  })
  if (found) {
    const deployedContracts = await getDeployed(name)

    if (deployedContracts !== '') {
      const defaultContract = deployedContracts.find(value => {
        return value.address === address
      })

      if (defaultContract) {
        const jsonPath = path.join(
          __dirname,
          '../../',
          found[name].path.replace('.sol', '.json')
        )
        const abiAndJson = fs.readFileSync(jsonPath, { encoding: 'utf8' })
        const newAJ = JSON.parse(abiAndJson)
        const toSaveJson = {
          ...newAJ,
          ...defaultContract
        }
        const toSave = `${found[name].path.replace(`.sol`, '.default.json')}`
        const filePath = path.join(__dirname, '../../', toSave)
        fs.writeFileSync(filePath, JSON.stringify(toSaveJson))
      }
    }
  }
  return null
}

export const readDefaultContractLocal = async name => {
  const contracts = await getContracts()
  const found = contracts.find(c => {
    return name === Object.keys(c)[0]
  })
  if (found) {
    const filePath = path.join(
      __dirname,
      '../../',
      found[name].path.replace('.sol', '.default.json')
    )
    try {
      return fs.readFileSync(filePath, { encoding: 'utf8' })
    } catch (error) {
      return null
    }
  }
  return null
}
