import yargs from 'yargs'
import { harmony, myAccount } from './harmony'
import { logOutput } from './util'

export async function transfer(
  to,
  amount = '0',
  gasLimit = '210000',
  gasPrice = '100',
  nonce
) {
  try {
    const beforeBalance = await myAccount.getBalance()
    let specificNonce = nonce !== undefined ? false : true
    const txnObject = {
      gasPrice: new harmony.utils.Unit(gasPrice).asGwei().toWei(),
      gasLimit: new harmony.utils.Unit(gasLimit).asWei().toWei(),
      to: harmony.crypto.getAddress(to).checksum,
      value: new harmony.utils.Unit(amount).asWei().toWei()
    }
    if (nonce) {
      txnObject.nonce = nonce
    }

    const txn = harmony.transactions.newTx(txnObject)

    const signed = await myAccount.signTransaction(txn, specificNonce)
    const sentTxn = await harmony.blockchain
      .createObservedTransaction(signed)
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
      txnHash: sentTxn.id
    })
    logOutput(`Got Transaction By hash again`, sameTransaction2.result)
    const txResult = sameTransaction2.result
    const valueBN = harmony.utils.hexToBN(txResult.value)
    const gasBN = harmony.utils.hexToBN(sentTxn.receipt.cumulativeGasUsed)
    const gasPriceBN = harmony.utils.hexToBN(txResult.gasPrice)
    const transactionFee = new harmony.utils.Unit(gasBN.mul(gasPriceBN))
      .asWei()
      .toWei()
    const actualCost = new harmony.utils.Unit(
      gasBN.mul(gasPriceBN).add(valueBN)
    )
      .asWei()
      .toWei()
    const afterBalance = await myAccount.getBalance()

    return {
      beforeBalance: beforeBalance.balance,
      afterBalance: afterBalance.balance,
      transferFrom: harmony.crypto.getAddress(sentTxn.from).bech32,
      transferTo: harmony.crypto.getAddress(sentTxn.to).bech32,
      transactionID: sentTxn.id,
      transactionFee: transactionFee.toString(),
      actualCost: actualCost.toString(),
      gas: harmony.utils.hexToNumber(txResult.gas),
      gasPrice: gasPriceBN.toString(),
      value: valueBN.toString(),
      comment: 'actualCost= gas * gasPrice + value'
    }
  } catch (error) {
    throw error
  }
}

// we deploy with command-line
if (process.argv0 !== undefined) {
  const argv = yargs
    .demandOption('to')
    .demandOption('amount')
    .alias('t', 'to')
    .alias('a', 'amount')
    .alias('l', 'gasLimit')
    .alias('p', 'gasPrice')
    .alias('n', 'nonce')
    .describe('t', 'transfer to')
    .describe('a', 'amount in wei')
    .describe('n', 'nonce to specify')
    .describe('l', 'gas limit in wei')
    .describe('p', 'gas price in Gwei').argv

  const to = argv.to
  const amount = argv.amount
  const nonce = argv.nonce
  const gasLimit = argv.gasLimit ? `${argv.gasLimit}` : '210000'
  const gasPrice = argv.gasPrice ? `${argv.gasPrice}` : '100'

  if (!harmony.utils.isValidAddress(to)) {
    console.log(`${to} is not valid address`)
    process.exit()
  } else {
    transfer(to, amount, gasLimit, gasPrice, nonce).then(result => {
      console.log('---- Transaction Summary ----')
      console.log('')
      console.log(`Transfer  From   : ${result.transferFrom}`)
      console.log(
        `       (CheckSum): ${
          harmony.crypto.getAddress(result.transferFrom).checksum
        }`
      )
      console.log(`Transfer  To     : ${result.transferTo}`)
      console.log(
        `       (CheckSum): ${
          harmony.crypto.getAddress(result.transferTo).checksum
        }`
      )
      console.log('')
      console.log('---- Balance Before Sent ----')
      console.log('')
      console.log(`Balance before   : ${result.beforeBalance} wei`)
      console.log('')
      console.log('---- Balance Deduction ----')
      console.log('')
      console.log(`Transfer Amount  : ${amount} wei`)
      console.log(`Transaction Fee  : ${result.transactionFee} wei`)
      console.log(`Sub Total        : ${result.actualCost} wei`)
      console.log('')
      console.log('---- Balance After Sent ----')
      console.log('')
      console.log(`Balance after    : ${result.afterBalance} wei`)
      console.log('')
      console.log('For detail, you can refer to: ')
      console.log(`https://ropsten.etherscan.io/tx/${result.transactionID}`)
      console.log('')

      // -----

      process.exit()
    })
  }
}
