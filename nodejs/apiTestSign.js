const { Harmony } = require('@harmony-js/core')
const { RLPSign } = require('@harmony-js/transaction')
const { ChainType, ChainID, hexToBN } = require('@harmony-js/utils')
var arg = process.argv.slice(2)[0];

//const url = 'http://localhost:9500'
//const url = 'http:/34.219.69.3:9500'


url = 'http://l0.b.hmny.io:9500'

testAccs = [
'01F903CE0C960FF3A9E68E80FF5FFC344358D80CE1C221C3F9711AF07F83A3BD'
]

if (arg=="localnet") {
	url = 'http://localhost:9500'

	testAccs = [
	'45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
	]

}

const receiver = '0x10A02A0a6e95a676AE23e2db04BEa3D1B8b7ca2E'


const harmony = new Harmony(url, {
  chainType: ChainType.Harmony,
  chainId: ChainID.Default
})


const sender = harmony.wallet.addByPrivateKey(testAccs[0])


const txnObjects = {
  nonce: 0,
  gasPrice: '0',
  gasLimit: '21000',
  shardID: 0,
  to: receiver,
  value: '1',
  data: '0x'
}

async function main() {
  try {
    const bbb = await harmony.blockchain.getBalance({
      address: sender.address
    })
    // logOutPut('senderBalance', bbb.result)
    const nonce = await harmony.blockchain.getTransactionCount({
      address: sender.address
    })
    // logOutPut('senderNonce', nonce.result)

    const tx = harmony.transactions.newTx({
      nonce: txnObjects.nonce,
      gasPrice: new harmony.utils.Unit(txnObjects.gasPrice).asWei().toWei(),
      gasLimit: new harmony.utils.Unit(txnObjects.gasLimit).asWei().toWei(),
      shardID: txnObjects.shardID,
      to: harmony.crypto.getAddress(txnObjects.to).checksum,
      value: new harmony.utils.Unit(txnObjects.value).asWei().toWei(),
      data: txnObjects.data
    })
    const signed = await sender.signTransaction(tx, true)
    // logOutPut('Signed Transation', signed.txParams)
    console.log(signed.getRawTransaction())
    process.exit()
    const [Transaction, hash] = await signed.sendTransaction()
    logOutPut('Transaction Hash', hash)
    // from here on, we use hmy_getTransactionRecept and hmy_blockNumber Rpc api
    // if backend side is not done yet, please delete them from here
    const confirmed = await Transaction.confirm(hash)

    // logOutPut('Transaction Receipt', confirmed.receipt)
    if (confirmed.isConfirmed()) {
      const senderUpdated = await harmony.blockchain.getBalance({
        address: sender.address
      })
      // logOutPut('Sender balance', senderUpdated.result)
      const receiverUpdated = await harmony.blockchain.getBalance({
        address: receiver
      })
      // logOutPut('Receiver balance', receiverUpdated.result)
      process.exit()
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
