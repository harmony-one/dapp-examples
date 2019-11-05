const { Harmony } = require('@harmony-js/core');
const { ChainID, ChainType } = require('@harmony-js/utils');
const {
  randomBytes,
  generatePrivateKey,
  getAddress,
  getAddressFromPrivateKey,
  encryptPhrase,
  decryptPhrase
} = require('@harmony-js/crypto');

const harmony = new Harmony('http://localhost:9500', {
  chainId: 2,
  chainType: 'hmy'
});

// TODO: seedphrase created by this.
const myPhrase = harmony.wallet.newMnemonic();
const pwd = '1234';

async function encryptThePhrase(phrase, pass) {
  const result = await encryptPhrase(phrase, pass);
  return result;
}

async function decryptThePhrase(keystore, pass) {
  const result = await decryptPhrase(keystore, pass);
  return result;
}

async function phraseKeyStore() {
  // TODO:
  // create new address and recovery are similar
  // the only difference is that in creating new address, we have to provide the end user with seed phrase
  // keyStore for one singe account is the keyStore followings
  const keyStore = await encryptThePhrase(myPhrase, pwd);

  // when signing we need to get private, we can get private key by the followings:
  const recoveredPhrase = await decryptThePhrase(JSON.parse(keyStore), pwd);
  return { myPhrase, keyStore, recoveredPhrase };
}

phraseKeyStore().then(result => {
  const { myPhrase, keyStore, recoveredPhrase } = result;

  harmony.wallet.addByMnemonic(myPhrase);
  console.log({ myPhrase, keyStore, recoveredPhrase });
  console.log(harmony.wallet);
  console.log(`------`);
});
