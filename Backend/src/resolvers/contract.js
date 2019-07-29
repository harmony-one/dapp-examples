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
