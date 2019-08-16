const WebSocket = require('ws');
const chalk = require('chalk');
const { RPCMethod } = require('@harmony-js/network');

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
  const payload = {
    jsonrpc: '2.0',
    id,
    method,
    params,
  };
  convos[id] = payload;
  ws.send(JSON.stringify(payload));
};

(async () => {
  const ws = new WebSocket('ws://localhost:9800');
  await new Promise(resolve => ws.on('open', resolve));
  ws.on('message', d => {
    const reply = JSON.parse(d);
    const { id, error } = reply;
    const lookup = convos[id];
    if (error) {
      console.error(
        chalk.red(`RPC method ${convos[id].method} failed. Reason: "${error.message}"`)
      );
      process.exit(-1);
    }
    console.log(chalk.green(`Sent RPC: ${JSON.stringify(convos[id], null, 2)}`));
    console.log(chalk.blue(`RPC reply: ${JSON.stringify(reply, null, 2)}`));
    console.log(chalk.yellow('-'.repeat(80)));
    console.log('\n');
  });
  console.log(chalk.yellow('WebSocket connection to Harmony RPC ready for use\n'));
  const send = send_rpc.bind(null, ws);
  const read_queries = () => {
    send(RPCMethod.ProtocolVersion, []);
    send(RPCMethod.NetVersion, []);
    send(RPCMethod.PeerCount, []);
    send(RPCMethod.Syncing, []);
    send(RPCMethod.GasPrice, []);
    send(RPCMethod.BlockNumber, []);
  };

  const write_queries = () => {
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

    // These need some arguments I dont know about yet
    // send(RPCMethod.GetPastLogs, []);
    // send(RPCMethod.GetCode, []);
    // send(RPCMethod.GetTransactionCount, []);
  };

  read_queries();
  write_queries();

  send(RPCMethod.GetTransactionReceipt, [
    '0x5c876ae425a8eba8658596854dbb70a23278c41d6db73c7e6e6b7dad458bfbe6',
  ]);
  // send(RPCMethod.NetVersion, []);
})();
