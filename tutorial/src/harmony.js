import fs from 'fs'
import { Harmony } from '@harmony-js/core'
import { ChainType, ChainID } from '@harmony-js/utils'

// loading setting
const setting = JSON.parse(fs.readFileSync('../setting.json'))

// loading setting from local json file
export const harmony = new Harmony(setting.url, {
  chainType: setting.chainType,
  chainId: setting.chainId
})

// loading Mne phrases from file
const phrases = fs.readFileSync('../phrase.txt', { encoding: 'utf8' })
// we use default index = 0
const index = 0

// add the phrase and index to Wallet, we get the account,
// and we export it for further usage
export const myAccount = harmony.wallet.addByMnemonic(phrases, index)
