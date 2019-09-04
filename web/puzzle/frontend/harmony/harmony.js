import { Harmony } from '@harmony-js/core';
import { isPrivateKey } from '@harmony-js/utils';
import fs from 'fs';

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

let accountImported
if (isPrivateKey(phrases)) {
    let key = phrases.trim()
    accountImported = harmony.wallet.addByPrivateKey(key)
} else {
    accountImported = harmony.wallet.addByMnemonic(phrases, index)
}
// add the phrase and index to Wallet, we get the account,
// and we export it for further usage
export const myAccount = accountImported
