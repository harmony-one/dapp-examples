const secp256k1 = require('secp256k1');
const keccak = require('keccak');
const randomBytes = require('randombytes');

/**
 * Transform a private key into an address
 */
const privateToAddress = privateKey => {
    const pub = secp256k1.publicKeyCreate(privateKey, false).slice(1);
    return keccak('keccak256')
        .update(pub)
        .digest()
        .slice(-20)
        .toString('hex');
};

/**
 * Create a wallet from a random private key
 * @returns {{address: string, privKey: string}}
 */
const getRandomWallet = () => {
    const randbytes = randomBytes(32);
    return {
        address: privateToAddress(randbytes).toString('hex'),
        private_key: randbytes.toString('hex')
    };
};

module.exports = {
    getRandomWallet,
    privateToAddress
};
