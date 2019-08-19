const { Wallet } = require('@harmony-js/account');
const WebSocket = require('ws');
const chalk = require('chalk');
const { RPCMethod } = require('@harmony-js/network');
const { encryptPhrase, decryptPhrase, getAddress } = require('@harmony-js/crypto');
const { Unit } = require('@harmony-js/utils');
const { Transaction, TxStatus, RLPSign } = require('@harmony-js/transaction');
const { Harmony } = require('@harmony-js/core');
const { ChainID, ChainType } = require('@harmony-js/utils');

let id = 0;

const convos = {};

const rpc_bank = new Set(Object.values(RPCMethod));

const send_rpc = (ws, method, params) => {
  if (!rpc_bank.has(method)) {
    console.error(`Already tested the RPC method: ${method}`);
    process.exit(-1);
  }
  rpc_bank.delete(method);
  id++;
  return new Promise(resolve => {
    const payload = {
      jsonrpc: '2.0',
      id,
      method,
      params,
    };
    convos[id] = { payload, resolve };
    ws.send(JSON.stringify(payload));
  });
};

const failing_rpc = send => {
  send(RPCMethod.GetWork, []);
  send(RPCMethod.GetProof, []);
};

const subscription_rpc = send => {
  throw new Error('Not implemented');
  send(RPCMethod.Subscribe, ['newHeads']);
};

const read_queries = send => {
  send(RPCMethod.ProtocolVersion, []);
  send(RPCMethod.NetVersion, []);
  send(RPCMethod.PeerCount, []);
  send(RPCMethod.Syncing, []);
  send(RPCMethod.GasPrice, []);
  send(RPCMethod.BlockNumber, []);
};

const write_queries = send => {
  send(RPCMethod.GetBalance, ['0x3aea49553Ce2E478f1c0c5ACC304a84F5F4d1f98', 'latest']);
  send(RPCMethod.GetBlockByNumber, [`0x1`, true]);
  send(RPCMethod.GetBlockByHash, [
    '0xe2247c266f64542f4c8fed37790790d2eb016c7a0a5fcf6ba5d02061fa414862',
    true,
  ]);
  send(RPCMethod.GetBlockTransactionCountByHash, [
    '0xe2247c266f64542f4c8fed37790790d2eb016c7a0a5fcf6ba5d02061fa414862',
  ]);
  send(RPCMethod.GetTransactionByHash, [
    '0xa427b2fa61d643bef9aefdb8fbc50aa25a8a72b6e0f7040576ee64aa32e01118',
  ]);
  send(RPCMethod.GetTransactionReceipt, [
    '0x5c876ae425a8eba8658596854dbb70a23278c41d6db73c7e6e6b7dad458bfbe6',
  ]);
  send(RPCMethod.GetTransactionCount, ['0x0b585f8daefbc68a311fbd4cb20d9174ad174016', 'latest']);
};

(async () => {
  const ws = new WebSocket('ws://localhost:9800');
  await new Promise(resolve => ws.on('open', resolve));
  ws.on('message', d => {
    const reply = JSON.parse(d);
    const { id, error } = reply;
    const { payload, resolve } = convos[id];
    if (error) {
      console.error(chalk.red(`RPC method ${payload.method} failed. Reason: "${error.message}"`));
      process.exit(-1);
    }
    console.log(chalk.green(`Sent RPC: ${JSON.stringify(payload, null, 2)}`));
    console.log(chalk.blue(`RPC reply: ${JSON.stringify(reply, null, 2)}`));
    console.log(chalk.yellow('-'.repeat(80)));
    console.log('\n');
    resolve();
  });
  console.log(chalk.yellow('WebSocket connection to Harmony RPC ready for use\n'));
  const send = send_rpc.bind(null, ws);
  read_queries(send);
  write_queries(send);
  // subscription_rpc(send);

  /* Now lets use the abstractions provided by the SDK */
  const harmony = new Harmony('ws://localhost:9800', {
    chainUrl: 'ws://localhost:9800',
    chainId: ChainID.Default,
    chainType: ChainType.Harmony,
  });

  // Note: mnes should be 75 length long
  const mnes = 'urge clog right example dish drill card maximum mix bachelor section select';
  const password = 'some phrase';
  const added_mnemonic = harmony.wallet.addByMnemonic(mnes, 0);
  await harmony.wallet.encryptAccount(added_mnemonic.address, password);

  const txn_object = {
    nonce: id,
    gasPrice: new Unit(0).asWei().toWei(),
    gasLimit: new Unit(21000).asWei().toWei(),
    shardID: 0,
    to: getAddress('one129r9pj3sk0re76f7zs3qz92rggmdgjhtwge62k').checksum,
    value: new Unit('1000000000000000000').asWei().toWei(),
    data: '0x',
  };

  const txn = harmony.transactions.newTx(txn_object);
  const signed = await harmony.wallet.signTransaction(txn, harmony.wallet.signer, password);
  console.log(signed.getRawTransaction());
  const [Transaction, hash] = await signed.sendTransaction();
  const confirmed = await Transaction.confirm(hash);
  console.log('Transaction Receipt', confirmed.receipt);
  if (confirmed.isConfirmed()) {
    console.log('transaction did go through');
  }
})();
