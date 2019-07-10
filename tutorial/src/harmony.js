import fs from 'fs'
import path from 'path'
import { Harmony } from '@harmony-js/core'
import { ChainType, ChainID } from '@harmony-js/utils'

// loading setting
const setting = JSON.parse(fs.readFileSync('../setting.json'))

// initializing Harmony instance
export const harmony = new Harmony(setting.url, {
  chainType: setting.chainType,
  chainId: setting.chainId
})

// loading Mne phrases from file
const phrases = fs.readFileSync('../phrase.txt', { encoding: 'utf8' })

// initializing HarmonyWallet, and add it to account
export const myAccount = harmony.wallet.addByMnemonic(phrases, 0)
