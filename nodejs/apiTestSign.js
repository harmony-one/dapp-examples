// Sample execution: node apiTestSign.js apiTestSignConfig/\[sample\]apiTestSign-localnet.config

const fs = require('fs');
const {Harmony} = require('@harmony-js/core');
const {ChainType, ChainID} = require('@harmony-js/utils');

if (process.argv.length !== 3) {
    console.error("Invalid number of Arguments (requires 1)");
    process.exit(1)
}

const config = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));

//Best to set the url in the config file.
//const url = 'http://localhost:9500'
//const url = 'http://s0.b.hmny.io:9500'
const url = config["url"];
const isVerbose = config["isVerbose"];
const isSequentialTxn = config["isSequentialTxn"];
const isRawTxnSigOnly = config["isRawTxnSigOnly"];
const transactions = config["transactions"];

const harmony = new Harmony(url, {
    chainType: ChainType.Harmony,
    chainId: ChainID.Default
});

if (harmony.provider.url !== url){
    console.error("'" + url + "' does not match url of provider, which is: '" + harmony.provider.url + "'");
    process.exit(1);
}

let results = new Array(transactions.length);

function logAndSaveResult(title, content, i) {
    if (!isRawTxnSigOnly) {
        if (results[i]===undefined){
            results[i] = {};
        }
        results[i][title] = JSON.stringify(content);
    }
    if (isVerbose) {
        console.log(
            '---------------------------------------------------------------------'
        );
        console.log("[Txn: " + i + " Log] " + title);
        console.log(content);
    }
}

async function send(sender, txnObjects, i) {
    try {
        const bbb = await harmony.blockchain.getBalance({
            address: sender.address
        });
        logAndSaveResult('senderBalance', bbb.result, i);
        const nonce = await harmony.blockchain.getTransactionCount({
            address: sender.address
        });
        logAndSaveResult('senderNonce', nonce.result, i);

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
        logAndSaveResult('Signed Transaction', signed.txParams, i);

        if (isRawTxnSigOnly) {
            results[i] = signed.getRawTransaction();
            if (i === (transactions.length - 1)) {
                console.log(results);
                process.exit(0);
            }
            return
        }

        const [Transaction, hash] = await signed.sendTransaction();
        logAndSaveResult('Transaction Hash', hash, i);

        // from here on, we use hmy_getTransactionRecept and hmy_blockNumber Rpc api
        // if backend side is not done yet, please delete them from here
        const confirmed = await Transaction.confirm(hash);
        logAndSaveResult('Transaction Receipt', confirmed.receipt, i);
        if (confirmed.isConfirmed()) {
            const senderUpdated = await harmony.blockchain.getBalance({
                address: sender.address
            });
            logAndSaveResult('Sender balance', senderUpdated.result, i);
            const receiverUpdated = await harmony.blockchain.getBalance({
                address: txnObjects.to
            });
            logAndSaveResult('Receiver balance', receiverUpdated.result, i);
        }

        if (i === (transactions.length - 1)) {
            console.log(results);
            process.exit(0);
        }
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}
setTimeout(send, 60000); // 1 min.

async function sendAllTxns() {
    for (let i = 0; i < transactions.length; i++) {
        let sender = harmony.wallet.addByPrivateKey(transactions[i]["sender"]);
        let txnObjects = transactions[i]["txnObjects"];
        if (isSequentialTxn) {
            await send(sender, txnObjects, i);
        } else {
            _ = send(sender, txnObjects, i);
        }
    }
}

_ = sendAllTxns();
