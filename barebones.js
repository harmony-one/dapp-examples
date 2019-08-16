const WebSocket = require('ws');
const chalk = require('chalk');
const { RPCMethod } = require('@harmony-js/network');

let id = 0;

const convos = {};

const send_rpc = (ws, method, params) => {
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
    send(RPCMethod.NetVersion, []);
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

    // These need some arguments I dont know about yet
    // send(RPCMethod.GetPastLogs, []);
    // send(RPCMethod.GetCode, []);
    // send(RPCMethod.GetTransactionCount, []);
  };

  read_queries();
  write_queries();

  send(RPCMethod.GetTransactionByHash, [
    '0xa427b2fa61d643bef9aefdb8fbc50aa25a8a72b6e0f7040576ee64aa32e01118',
  ]);
  // send(RPCMethod.NetVersion, []);
  // send(RPCMethod.NetVersion, []);
})();
