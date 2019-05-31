const { Harmony } = require('@harmony-js/core')
const { RLPSign } = require('@harmony-js/transaction')
const { ChainType, ChainID, hexToBN } = require('@harmony-js/utils')

// const url = 'https://ropsten.infura.io/v3/4f3be7f5bbe644b7a8d95c151c8f52ec'
const url = 'http://localhost:9500'

// const harmony = new Harmony(url, ChainType.Ethereum, ChainID.Ropsten)

const harmony = new Harmony(url, ChainType.Harmony)

const testAccs = [
  '3c8642f7188e05acc4467d9e2aa7fd539e82aa90a5497257cf0ecbb98ed3b88f'
  // 'food response winner warfare indicate visual hundred toilet jealous okay relief tornado'
]

const sender = harmony.wallet.addByPrivateKey(testAccs[0])
// const sender = harmony.wallet.addByMnemonic(testAccs[0])
const receiver = '0x10A02A0a6e95a676AE23e2db04BEa3D1B8b7ca2E'

const txnObjects = {
  nonce: 0,
  gasPrice: '0',
  gasLimit: '21000',
  shardID: 0,
  to: receiver,
  value: '1000000000000000000',
  data: '0x'
}

// const txnObjects = {
//   // nonce: 0,
//   gasPrice: '100000',
//   gasLimit: '21000',
//   shardID: 0,
//   to: receiver,
//   value: '100000',
//   data: '0x'
// }

async function main() {
  try {
    const bbb = await harmony.blockchain.getBalance({ address: sender.address })
    logOutPut('senderBalance', bbb.result)

    const tx = harmony.transactions.newTx({
      nonce: txnObjects.nonce,
      gasPrice: new harmony.utils.Unit(txnObjects.gasPrice).asWei().toWei(),
      gasLimit: new harmony.utils.Unit(txnObjects.gasLimit).asWei().toWei(),
      shardID: txnObjects.shardID,
      to: txnObjects.to,
      value: new harmony.utils.Unit(txnObjects.value).asWei().toWei(),
      data: txnObjects.data
    })

    const signed = await sender.signTransaction(tx, true)
    logOutPut('Signed Transation', signed.txParams)

    const [Transaction, hash] = await signed.sendTransaction()
    logOutPut('Transaction Hash', hash)

    // from here on, we use hmy_getTransactionRecept and hmy_blockNumber Rpc api
    // if backend side is not done yet, please delete them from here

    const confirmed = await Transaction.confirm(hash)
    logOutPut('Transaction Receipt', confirmed.receipt)

    if (confirmed.isConfirmed()) {
      const senderUpdated = await harmony.blockchain.getBalance({
        address: sender.address
      })
      logOutPut('Sender balance', senderUpdated.result)

      const receiverUpdated = await harmony.blockchain.getBalance({
        address: receiver
      })
      logOutPut('Receiver balance', receiverUpdated.result)
    }
  } catch (error) {
    throw error
  }
}

function logOutPut(title, content) {
  console.log(
    '---------------------------------------------------------------------'
  )
  console.log(`==> Log: ${title}`)
  console.log(
    '---------------------------------------------------------------------'
  )
  console.log()
  console.log(content)
  console.log()
}

main()
