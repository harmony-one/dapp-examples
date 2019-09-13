const fs = require('fs')
const { harmony } = require('./harmony')
const path = require('path')

// const address = '0x0cc3a6E43e66DC35a45f26e95A8c084c343a7D07'
// const address = '0x8545890931331d3EA59b4e63dE64924BE181C4Aa'
// const address = '0xD5626B6146100CE4e2BEDa0038afE82e9814D8f9'
const address = '0x8545890931331d3EA59b4e63dE64924BE181C4Aa';

// 0x3308726dacd2daf7c74d48118b053a732ba7582d709cbe0f8787501b0805ec57 0x2618dEB50250526249BB3dBcbC614df14214907C
// 0x8e099a1b406d788b1bb4cfd7afd6fbb77209c139707411276f6a38c22e2fcc27 0x405CfA22555f0d1a728c8dE278899634a0cb35E7

const { abi } = JSON.parse(fs.readFileSync(path.resolve(__dirname, './contracts/puzzle/Puzzle.json')))


const puzzle = harmony.contracts.createContract(abi, address)

const getManager = async () => {
  const result = await puzzle.methods
    .manager() // static method
    .call({ gasLimit: '210000', gasPrice: '10000000000' })
  return result
}

const getLevel = async address => {
  const result = await puzzle.methods
    .getLevel(address)
    .call({ gasLimit: '210000', gasPrice: '10000000000' })
  return result
}
const getSequence = async address => {
  const result = await puzzle.methods
    .getSequence(address)
    .call({ gasLimit: '210000', gasPrice: '10000000000' })
  return result
}

const payout = async (address, level, sequence) => {
  const result = await puzzle.methods
    .payout(address, level, sequence)
    .send({ gasLimit: '210000', gasPrice: '10000000000' })
  // contract instance, if you want receipt, use `result.transaction.receipt`
  // console.log(result.transaction.receipt)
  return result
}

module.exports = {
  puzzle,
  getManager,
  getSequence,
  payout
}
// payout('0x3aea49553Ce2E478f1c0c5ACC304a84F5F4d1f98', 10, '1')
// payout('0x3aea49553Ce2E478f1c0c5ACC304a84F5F4d1f98', 10, '1')
// getManager().then(console.log)
// payout('0x327170633eaa7d31a5bf3aa4b60e20c826b2eddf', 16, 'LRDU').then(
//   console.log
// )

// getSequence('0x10A02A0a6e95a676AE23e2db04BEa3D1B8b7ca2E').then(
//   console.log
// )
// process.exit(0)
