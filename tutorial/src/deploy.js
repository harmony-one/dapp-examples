import fs from 'fs'
import path from 'path'
import yargs from 'yargs'
import { TransactionFactory } from '@harmony-js/transaction'
import { harmony, myAccount } from './harmony'
import { compileContract } from './compile'
import { logOutput } from './util'

export async function checkMyAccount(account) {
  const result = await account.getBalance()
  if (result.balance === '0') {
    console.log('Account balance is 0')
    return false
  }
  return true
}

export async function deployContract(contract, bin, gasLimit, gasPrice, nonce) {
  const beforeBalance = await myAccount.getBalance()

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
    // nonce: nonce !== undefined ? nonce : beforeBalance.nonce
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
      logOutput('We got Transaction Hash', transactionHash)
      harmony.blockchain
        .getTransactionByHash({
          txnHash: transactionHash
        })
        .then(res => {
          logOutput('We got transaction detail', res.result)
        })
    })
    // when we get receipt, it will emmit
    .on('receipt', receipt => {
      logOutput('We got transaction receipt', receipt)
    })
    // the http and websocket provider will be poll result and try get confirmation from time to time.
    // when `confirmation` comes in, it will be emitted
    .on('confirmation', confirmation => {
      logOutput(`The transaction is`, confirmation)
    })
    // if something wrong happens, the error will be emitted
    .on('error', error => {
      logOutput(`Something wrong happens`, error)
    })

  const sameTransaction2 = await harmony.blockchain.getTransactionByHash({
    txnHash: deployed.transaction.id
  })

  logOutput(`Got Transaction By hash again`, sameTransaction2.result)

  const txResult = sameTransaction2.result
  const valueBN = harmony.utils.hexToBN(txResult.value)
  const gasBN = harmony.utils.hexToBN(
    deployed.transaction.receipt.cumulativeGasUsed
  )
  const gasPriceBN = harmony.utils.hexToBN(txResult.gasPrice)
  const transactionFee = new harmony.utils.Unit(gasBN.mul(gasPriceBN))
    .asWei()
    .toWei()
  const actualCost = new harmony.utils.Unit(gasBN.mul(gasPriceBN).add(valueBN))
    .asWei()
    .toWei()
  const afterBalance = await myAccount.getBalance()

  return {
    contractAddress: deployed.address,
    beforeBalance: beforeBalance.balance,
    afterBalance: afterBalance.balance,
    transferFrom: harmony.crypto.getAddress(myAccount.address).bech32,
    transferTo: '0x',
    transactionID: deployed.transaction.id,
    transactionFee: transactionFee.toString(),
    actualCost: actualCost.toString(),
    gas: harmony.utils.hexToNumber(txResult.gas),
    gasPrice: gasPriceBN.toString(),
    value: valueBN.toString(),
    comment: 'actualCost= gas * gasPrice + value'
  }
}

export async function deploy(file, gasLimit, gasPrice, nonce, compileTo) {
  // compile the sol file first, and get the abi and bin
  const { abi, bin } = compileContract(file, compileTo)

  // now we create a contract instance use `Harmony.contracts.createContract`

  const myContract = harmony.contracts.createContract(abi)
  const tradable = await checkMyAccount(myAccount)

  // const getNonce = await harmony.blockchain.getTransactionCount({
  //   address: myAccount.address
  // })

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
    const contractAddress = deployed.contractAddress
    // and the contract byte code that deployed to blockchain
    const contractCode = await harmony.blockchain.getCode({
      address: contractAddress
    })

    // we return it as result
    const result = {
      contract: deployed,
      contractCode: contractCode.result,
      contractAddress
    }

    console.log('---- Transaction Summary ----')
    console.log('')
    console.log(`Transfer  From   : ${deployed.transferFrom}`)
    console.log(
      `       (CheckSum): ${
        harmony.crypto.getAddress(deployed.transferFrom).checksum
      }`
    )

    console.log('')
    console.log('---- Balance Before Sent ----')
    console.log('')
    console.log(`Balance before   : ${deployed.beforeBalance} wei`)
    console.log('')
    console.log('---- Balance Deduction ----')
    console.log('')
    console.log(`Transfer Amount  : ${0} wei`)
    console.log(`Transaction Fee  : ${deployed.transactionFee} wei`)
    console.log(`Sub Total        : ${deployed.actualCost} wei`)
    console.log('')
    console.log('---- Balance After Sent ----')
    console.log('')
    console.log(`Balance after    : ${deployed.afterBalance} wei`)
    console.log('')
    console.log('')
    console.log(`-- hint: contract is deployed to`)
    console.log(``)
    console.log(result.contractAddress)
    console.log(``)
    console.log(``)
    // console.log('For detail, you can refer to: ')
    // console.log(`https://ropsten.etherscan.io/tx/${result.transactionID}`)
    // console.log('')

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
  const gasLimit = argv.gasLimit ? `${argv.gasLimit}` : '210000'
  const gasPrice = argv.gasPrice ? `${argv.gasPrice}` : '100'
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
