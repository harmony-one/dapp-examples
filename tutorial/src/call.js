import fs from 'fs'
import yargs from 'yargs'
import { harmony } from './harmony'
import { BN } from '@harmony-js/crypto'
import { logOutput } from './util'

export async function callContract(abi, contractAddress, method, ...args) {
  const deployedContract = harmony.contracts.createContract(
    abi,
    contractAddress
  )

  const methodClass = deployedContract.methods[method].apply(null, args)

  const callResult = await methodClass.call({
    gasLimit: new BN('210000'),
    gasPrice: new BN('10000000000')
  })

  return {
    callResult,
    callResponseHex: methodClass.callResponse.result,
    callPayload: methodClass.callPayload
  }
}
export async function alterContractEvent(
  abi,
  contractAddress,
  method,
  ...args
) {
  const deployedContract = harmony.contracts.createContract(
    abi,
    contractAddress
  )

  // if blockchain support event system it should work
  // deployedContract.events
  //   .DemoEvent({ fromBlock: 'latest' })
  //   .on('data', data => {
  //     logOutput('event data', data)
  //   })
  //   .on('changed', changed => {
  //     logOutput('event changed', changed)
  //   })
  //   .on('error', error => {
  //     logOutput('event error', error)
  //   })

  const methodClass = deployedContract.methods[method].apply(null, args)

  const sendResult = await methodClass.send({
    gasLimit: new BN('210000'),
    gasPrice: new BN('10000000000')
  })

  return sendResult
}

// command line only
if (process.argv0 !== undefined && process.argv.slice(2)[0] !== undefined) {
  const argv = yargs
    .demandOption('file')
    .demandOption('address')
    .alias('f', 'file')
    .alias('a', 'address')
    .alias('i', 'info')
    .describe('f', '{contract}.json')
    .describe('a', 'contract address string')
    .describe('i', '{contract}-{address}.json').argv
  const abiFile = JSON.parse(fs.readFileSync(argv.file, 'utf8'))
  const { abi } = abiFile
  const contractAddress = harmony.utils.isValidAddress(argv.address)
    ? argv.address
    : JSON.parse(fs.readFileSync(argv.info, 'utf8')).contractAddress

  callContract(abi, contractAddress, 'print').then(result => {
    logOutput('method called: print', result)
  })
  callContract(abi, contractAddress, 'add', 123, 321).then(result => {
    logOutput('method called: add', result)
  })
  callContract(abi, contractAddress, 'manager').then(result => {
    logOutput('method called: manager', result)
  })
  alterContractEvent(abi, contractAddress, 'fireEvent', 444).then(result => {
    logOutput('altered contract with fireEvent', result)
  })
}
