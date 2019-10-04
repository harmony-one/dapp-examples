const fs = require('fs');
const { harmonyArray } = require('./harmony_shards');
const path = require('path');

const contractAddress = [
  `0xd4be063e149e8af6605e1bae1019014472863462`,
  `0xba9e0f55f5142df4916631e1e5509ead6cea9ad8`,
  `0xba9e0f55f5142df4916631e1e5509ead6cea9ad8`,
  `0xba9e0f55f5142df4916631e1e5509ead6cea9ad8`
];

const { abi } = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, './contracts/puzzle/Puzzle.json'))
);

const puzzle = contractAddress.map((address, index) =>
  harmonyArray[index].contracts.createContract(abi, contractAddress[index])
);
// harmony.contracts.createContract(abi, contractAddress);

const getManager = async shardID => {
  const result = await puzzle[shardID].methods
    .manager() // static method
    .call({ gasLimit: '210000', gasPrice: '10000000000' });
  return result;
};

const getLevel = async (shardID, address) => {
  const result = await puzzle[shardID].methods
    .getLevel(address)
    .call({ gasLimit: '210000', gasPrice: '10000000000' });
  return result;
};
const getSequence = async (shardID, address) => {
  const result = await puzzle[shardID].methods
    .getSequence(address)
    .call({ gasLimit: '210000', gasPrice: '10000000000' });
  return result;
};

const payout = async (shardID, address, level, sequence) => {
  const result = await puzzle[shardID].methods
    .payout(address, level, sequence)
    .send({ gasLimit: '210000', gasPrice: '10000000000' });
  return result;
};

module.exports = {
  puzzle,
  getManager,
  getSequence,
  payout
};
// payout('0x3aea49553Ce2E478f1c0c5ACC304a84F5F4d1f98', 10, '1')
// payout('0x3aea49553Ce2E478f1c0c5ACC304a84F5F4d1f98', 10, '1')
// getManager().then(console.log)
// payout(0, '0x327170633eaa7d31a5bf3aa4b60e20c826b2eddf', 16, 'LRDU').then(
//   console.log
// );

// getSequence('0x327170633eaa7d31a5bf3aa4b60e20c826b2eddf').then(console.log);
// process.exit(0)
