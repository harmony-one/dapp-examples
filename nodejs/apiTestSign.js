const fs = require('fs');
const { Harmony } = require('@harmony-js/core');
const { ChainType, ChainID } = require('@harmony-js/utils');

if (process.argv.length !== 3){
  console.error("Invalid number of Arguments (requires 1)");
  process.exit(1)
}

let config;
try {
  config = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
} catch (err) {
  console.error("Config file read error: " + err);
  process.exit(1);
}

//Best to set the url in the config file.
//const url = 'http://localhost:9500'
//const url = 'http:/s0.b.hmny.io:9500'
const url = config["url"];

const harmony = new Harmony(url, {
  chainType: ChainType.Harmony,
  chainId: ChainID.Default
});

const verbose = config["verbose"];
const transactions = config["transactions"];
let results = new Array(transactions.length);
for (let i=0; i<transactions.length; i++){
  results[i] = {
    "senderBalance" : null,
    "senderNonce" : null,
    "Signed Transaction" : null,
    "Transaction Hash" : null,
    "Transaction Receipt" : null,
    "Sender balance" : null,
    "Receiver balance" : null
  };
}

function logAndSave(title, content, i) {
  results[i][title] = JSON.stringify(content);

  if (verbose){
    console.log(
        '---------------------------------------------------------------------'
    );
    console.log("[Log] " + title);
    console.log(content);
  }

  // This condition is where the program terminates.
  if (i === (transactions.length-1) && title === 'Receiver balance'){
    console.log(results);  // These logs
    process.exit(0);
  }
}

async function send(sender, txnObjects, i) {
  try {
    const bbb = await harmony.blockchain.getBalance({
      address: sender.address
    });
    logAndSave('senderBalance', bbb.result, i);
    const nonce = await harmony.blockchain.getTransactionCount({
      address: sender.address
    });
    logAndSave('senderNonce', nonce.result, i);

    const tx = harmony.transactions.newTx({
      nonce: txnObjects.nonce,
      gasPrice: new harmony.utils.Unit(txnObjects.gasPrice).asWei().toWei(),
      gasLimit: new harmony.utils.Unit(txnObjects.gasLimit).asWei().toWei(),
      shardID: txnObjects.shardID,
      to: harmony.crypto.getAddress(txnObjects.to).checksum,
      value: new harmony.utils.Unit(txnObjects.value).asWei().toWei(),
      data: txnObjects.data
    });
    const signed = await sender.signTransaction(tx, true);
    logAndSave('Signed Transaction', signed.txParams, i);
    const [Transaction, hash] = await signed.sendTransaction();
    logAndSave('Transaction Hash', hash, i);

    // from here on, we use hmy_getTransactionRecept and hmy_blockNumber Rpc api
    // if backend side is not done yet, please delete them from here
    const confirmed = await Transaction.confirm(hash);
    logAndSave('Transaction Receipt', confirmed.receipt, i);
    if (confirmed.isConfirmed()) {
      const senderUpdated = await harmony.blockchain.getBalance({
        address: sender.address
      });
      logAndSave('Sender balance', senderUpdated.result, i);
      const receiverUpdated = await harmony.blockchain.getBalance({
        address: txnObjects.to
      });
      logAndSave('Receiver balance', receiverUpdated.result, i);
    }
  } catch (error) {
    throw error
  }
}

async function sendAllTxns() {
  for(let i = 0; i < transactions.length; i++){
    let sender = harmony.wallet.addByPrivateKey(transactions[i]["sender"]);
    let txnObjects = transactions[i]["txnObjects"];
    await send(sender, txnObjects, i);
  }
}
_ = sendAllTxns();