const { harmony } = require('./harmony')
const abi = require('./build/Puzzle.json')

const address = ''

const puzzle = harmony.contracts.createContract(abi, address)

// getPlayers()": "8b5b9ccc",
//     "manager()": "481c6a75",
//     "payout(address,uint256)": "117de2fd",
//     "play()": "93e84cd9",
//     "players(uint256)": "f71d96cb",
//     "reset()": "d826f88f",
//     "resetPlayer(address)": "c95e0909"

export const getPlayers = async () => {
  const result = await puzzle.methods
    .getPlayers() // static method
    .call({ gasLimit: '210000', gasPrice: '10000000000' })
  return result
}
