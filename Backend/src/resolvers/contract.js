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
