const {
  randomBytes,
  generatePrivateKey,
  getAddress,
  getAddressFromPrivateKey,
} = require('@harmony-js/crypto');

function randomBech32Address() {
  const bech32 = getAddress(getAddressFromPrivateKey(generatePrivateKey())).bech32;
  return bech32
}

console.log(randomBech32Address());
