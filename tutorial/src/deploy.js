import fs from 'fs'
import path from 'path'
import yargs from 'yargs'
import { harmony, myAccount } from './harmony'
import { compileContract } from './compile'

export async function checkMyAccount(account) {
  const result = await account.getBalance()
  if (result.balance === '0') {
    console.log('Account balance is 0')
    return false
  }
  return true
}

export async function deployContract(contract, bin, gasLimit, gasPrice, nonce) {
  const txnObj = {
    // gasLimit defines the max value that blockchain will consume
    // here we show that you can use Unit as calculator
    // because we use BN as our save integer as default input
    // use Unit converter is much safer
    gasLimit: new harmony.utils.Unit(gasLimit).asWei().toWei(),
    // gasPrice defines how many weis should be consumed each gas
    // you can use `new BN(string)` directly,
    // if you are sure about the amount is calculated in `wei`
    gasPrice: new harmony.utils.Unit(gasPrice).asGwei().toWei()
  }

  if (nonce) {
    // we mannually set nonce only when if we want to override transaction when it is still pending.
    txnObj.nonce = nonce
  }

  const deployed = await contract
    .deploy({
      // the data key puts in the bin file with `0x` prefix, because `solc` compiler would add `0x` to it
      data: `0x${bin}`,
      // we don't have any initial arguments to put in of this contract, so we leave blank
      arguments: []
    })
    .send(txnObj)
    // we use event emitter to listen the result when event happen
    // here comes in the `transactionHash`
    .on('transactionHash', transactionHash => {
      console.log(`-- hint: we got Transaction Hash`)
      console.log(``)
      console.log(`${transactionHash}`)
      console.log(``)
      console.log(``)

      harmony.blockchain
        .getTransactionByHash({
          txnHash: transactionHash
        })
        .then(res => {
          console.log(`-- hint: we got transaction detail`)
          console.log(``)
          console.log(res)
          console.log(``)
          console.log(``)
        })
    })
    // when we get receipt, it will emmit
    .on('receipt', receipt => {
      console.log(`-- hint: we got transaction receipt`)
      console.log(``)
      console.log(receipt)
      console.log(``)
      console.log(``)
    })
    // the http and websocket provider will be poll result and try get confirmation from time to time.
    // when `confirmation` comes in, it will be emitted
    .on('confirmation', confirmation => {
      console.log(`-- hint: the transaction is`)
      console.log(``)
      console.log(confirmation)
      console.log(``)
      console.log(``)
    })
    // if something wrong happens, the error will be emitted
    .on('error', error => {
      console.log(`-- hint: something wrong happens`)
      console.log(``)
      console.log(error)
      console.log(``)
      console.log(``)
    })
  return deployed
}

export async function deploy(file, gasLimit, gasPrice, nonce, compileTo) {
  // compile the sol file first, and get the abi and bin
  const { abi, bin } = compileContract(file, compileTo)

  // now we create a contract instance use `Harmony.contracts.createContract`

  const myContract = harmony.contracts.createContract(abi)
  const tradable = await checkMyAccount(myAccount)
  if (tradable) {
    // here we make it deployed
    const deployed = await deployContract(
      myContract,
      bin,
      gasLimit,
      gasPrice,
      nonce
    )

    // we get the contract's address
    const contractAddress = deployed.address
    // and the contract byte code that deployed to blockchain
    const contractCode = await harmony.blockchain.getCode({
      address: deployed.address
    })

    // we return it as result
    const result = {
      contract: deployed,
      contractCode: contractCode.result,
      contractAddress
    }
    console.log(`-- hint: contract is deployed`)
    console.log(``)
    console.log(result)
    console.log(``)
    console.log(``)

    return result
  } else {
    console.log(`-- hint: cannot deploy contract`)
    return null
  }
}

// we deploy with command-line
if (process.argv0 !== undefined) {
  const argv = yargs
    .demandOption('file')
    .alias('f', 'file')
    .alias('t', 'to')
    .alias('l', 'gasLimit')
    .alias('p', 'gasPrice')
    .alias('n', 'nonce')
    .describe('f', 'file to compile')
    .describe('t', 'save compiled file to')
    .describe('l', 'gas limit in wei')
    .describe('n', 'specific nonce')
    .describe('p', 'gas price in Gwei').argv

  const file = argv.file
  const compileTo = argv.compileTo || argv.file.replace('.sol', '.json')
  const gasLimit = `${argv.gasLimit}` || '210000'
  const gasPrice = `${argv.gasPrice}` || '100'
  const nonce = argv.nonce

  deploy(file, gasLimit, gasPrice, nonce, compileTo).then(result => {
    const timeStamp = new Date().toJSON()
    const { contractCode, contractAddress } = result
    fs.writeFileSync(
      path.resolve(file.replace('.sol', `-${contractAddress}.json`)),
      JSON.stringify({
        contractCode,
        contractAddress,
        timeStamp
      })
    )
    process.exit()
  })
}
// deploy()
