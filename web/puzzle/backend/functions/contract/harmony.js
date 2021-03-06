const { Harmony } = require('@harmony-js/core');
const { isPrivateKey } = require('@harmony-js/utils');
const fs = require('fs');
const path = require('path');

// loading setting
const setting = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, './setting.json'))
);

// loading setting from local json file
const harmony = new Harmony(setting.url, {
  chainType: setting.chainType,
  chainId: setting.chainId,
  shardID: setting.shardID
});

// loading Mne phrases from file
// const phrases = fs.readFileSync(path.resolve(__dirname, './phrase.txt'), { encoding: 'utf8' })
// we use default index = 0
// TODO(set up environment of phrases)
const phrases =
  '02D7461FF25366D3A1CE627B5749C74168D358F00ABF3321681633C97AF85614';
const index = 0;

let accountImported;
if (isPrivateKey(phrases)) {
  let key = phrases.trim();
  accountImported = harmony.wallet.addByPrivateKey(key);
} else {
  accountImported = harmony.wallet.addByMnemonic(phrases, index);
}
// add the phrase and index to Wallet, we get the account,
// and we export it for further usage
const myAccount = accountImported;

module.exports = {
  harmony,
  myAccount
};
