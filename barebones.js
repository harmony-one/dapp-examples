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
    console.log(chalk.blue(`RPC reply: ${JSON.stringify(reply, null, 2)}\n`));
  });
  console.log(chalk.yellow('WebSocket connection to Harmony RPC ready for use\n'));
  const send = send_rpc.bind(null, ws);
  send(RPCMethod.GetBalance, ['0x3aea49553Ce2E478f1c0c5ACC304a84F5F4d1f98', 'latest']);
  send(RPCMethod.ProtocolVersion, []);
  send(RPCMethod.NetVersion, []);

  send(RPCMethod.GetPastLogs, []);
  // send(RPCMethod.NetVersion, []);
  // send(RPCMethod.NetVersion, []);
  // send(RPCMethod.NetVersion, []);
  // send(RPCMethod.NetVersion, []);
  // send(RPCMethod.NetVersion, []);
  // send(RPCMethod.NetVersion, []);
  // send(RPCMethod.NetVersion, []);
  // send(RPCMethod.NetVersion, []);
  // send(RPCMethod.NetVersion, []);
  // send(RPCMethod.NetVersion, []);
  // send(RPCMethod.NetVersion, []);
  // send(RPCMethod.NetVersion, []);
  // send(RPCMethod.NetVersion, []);
})();
