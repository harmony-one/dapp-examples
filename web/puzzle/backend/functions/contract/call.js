const fs = require('fs')
const { harmony } = require('./harmony')
const path = require('path')

// const address = '0x0cc3a6E43e66DC35a45f26e95A8c084c343a7D07'
const address = '0x8545890931331d3EA59b4e63dE64924BE181C4Aa'

const { abi } = JSON.parse(fs.readFileSync(path.resolve(__dirname, './contracts/puzzle/Puzzle.json')))


const puzzle = harmony.contracts.createContract(abi, address)

// getPlayers()": "8b5b9ccc",
//     "manager()": "481c6a75",
//     "payout(address,uint256)": "117de2fd",
//     "play()": "93e84cd9",
//     "players(uint256)": "f71d96cb",
//     "reset()": "d826f88f",
//     "resetPlayer(address)": "c95e0909"

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

// payout('0x3aea49553Ce2E478f1c0c5ACC304a84F5F4d1f98', 10, '1')
// getManager().then(console.log)
// payout('0x10A02A0a6e95a676AE23e2db04BEa3D1B8b7ca2E', 15, 'LRDU').then(
//   console.log
// )
// process.exit(0)

module.exports = {
  payout
}
