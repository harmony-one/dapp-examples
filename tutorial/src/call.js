import fs from 'fs'
import { harmony } from './harmony'
import { BN } from '@harmony-js/crypto'

export async function callContract(abi, contractAddress, method, ...args) {
  const deployedContract = harmony.contracts.createContract(
    abi,
    contractAddress
  )

  const callResult = await deployedContract.methods[method].apply(null, args)
    .call({ gasLimit: new BN('210000'), gasPrice: new BN('10000000000') })
  return callResult
}

// command line only
if (process.argv0 !== undefined && process.argv.slice(2)[0] !== undefined) {
  const abiFile = JSON.parse(fs.readFileSync(process.argv.slice(2)[0], 'utf8'))
  const { abi } = abiFile
  const contractAddress = harmony.utils.isValidAddress(process.argv.slice(2)[1])
    ? process.argv.slice(2)[1]
    : JSON.parse(fs.readFileSync(process.argv.slice(2)[1], 'utf8'))
        .contractAddress
  callContract(abi, contractAddress, "print").then(result => {
    console.log("print", result)
  })
  callContract(abi, contractAddress, "add", 123, 321).then(result => {
    console.log("add", result)
  })
}
