const { Harmony } = require('@harmony-js/core')
const { ChainID, ChainType } = require('@harmony-js/utils')

const Settings = {
  Ropsten: {
    http: 'https://ropsten.infura.io/v3/4f3be7f5bbe644b7a8d95c151c8f52ec',
    ws: 'wss://ropsten.infura.io/ws/v3/4f3be7f5bbe644b7a8d95c151c8f52ec',
    type: ChainType.Ethereum,
    id: ChainID.Ropsten
  },
  Rinkeby: {
    http: 'https://rinkeby.infura.io/v3/4f3be7f5bbe644b7a8d95c151c8f52ec',
    ws: 'wss://rinkeby.infura.io/ws/v3/4f3be7f5bbe644b7a8d95c151c8f52ec',
    type: ChainType.Ethereum,
    id: ChainID.Rinkeby
  },
  Ganache: {
    http: 'http://localhost:18545',
    ws: 'ws://localhost:18545',
    type: ChainType.Ethereum,
    id: ChainID.Ganache
  }
}

// a function that will map the setting to harmony class constructor inputs
function useSetting(setting, providerType) {
  return [
    setting[providerType],
    { chainType: setting.type, chainId: setting.id }
  ]
}

// simply change `Ropsten` to `Rinkeby` to test with different testnet
// and switch `ws` or `http` as RPC provider

const harmony = new Harmony(...useSetting(Settings.Ropsten, 'ws'))

// import our preset mnes
const mne =
  'food response winner warfare indicate visual hundred toilet jealous okay relief tornado'

// now we have the mnes added to wallet
const acc1 = harmony.wallet.addByMnemonic(mne, 0)
const acc2 = harmony.wallet.addByMnemonic(mne, 1)

// now we create contract using extracted abi
// const myContract = harmony.contracts.createContract(abi)
// harmony.blockchain.getBalance({ address: acc1.address }).then(console.log)
console.log(acc1.privateKey)
// first we get the account's balance to see if we have enough token on the testnet
// acc1.getBalance().then(res => {
//   console.log(`-- hint: account balance of ${acc1.address}`)
//   console.log(``)
//   console.log({ account: res })
//   console.log(``)
//   console.log(``)
// })
// acc2.getBalance().then(res => {
//   console.log(`-- hint: account balance of ${acc2.address}`)
//   console.log(``)
//   console.log({ account: res })
//   console.log(``)
//   console.log(``)
// })
