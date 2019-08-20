const { Harmony } = require('@harmony-js/core')
const { Wallet } = require('@harmony-js/account')

// first intializing the harmony with rpc endoint
const jsonRpcUrl = 'http://localhost:9500'
const harmony = new Harmony(jsonRpcUrl)

// harmony.wallet has the wallet instance

async function createAccount() {
  // now there are 2 ways to generate account
  // 1. input private key and added to wallet
  // 2. input seedphrase and added to wallet

  // for better end-user experience, like meta-mask does, the working flow like this:
  // 1. give account a name, it should be done by app as shown to user, not sdk.
  // perhaps store it in localstorage or some front-end database

  const accountName = 'My First Account'

  // 2. ask user to input password and confirm again
  // if we pass the 2-times-validator
  // we then use the password later

  let password

  const passwordFirst = 'MyVeryStrongPassword'
  logOutPut('input password first time', passwordFirst)

  const passwordConfirmed = 'MyVeryStrongPassword'
  logOutPut('input password second time', passwordConfirmed)

  if (passwordFirst !== passwordConfirmed) {
    throw new Error('password is not correct')
  }

  password = passwordConfirmed

  logOutPut('Your password is', password)

  // 3. generate seed phrase, according to BIP-44, and ask user to write it down
  const seed = Wallet.generateMnemonic()

  // see log here:
  logOutPut('seed phrase created', seed)

  // 2. then add the seed phrase to wallet, each phrase can generate multiple accounts using index.
  // that actually create different private keys, however user don't want to remember them all.
  // we use 0 to use the first index according to BIP-39
  // please note that same seed and same index, generate same privateKey, which is constant.
  // just for example , we add one account each time.
  // note that the first account will be the signer of wallet

  const signer = harmony.wallet.addByMnemonic(seed, 0)

  // 3. now the account is created, but it is not encrypted yet, we use the password that user confirmed earlier.
  // how ever the encrypt process is async, because it may cause your app runs encryption.
  // we use `Wallet.encryptAccont(address:string, password:string)` to encrypt the account

  await harmony.wallet.encryptAccount(signer.address, password)

  // 4. now the private key is encrypted to keystore format.

  logOutPut('your private key is encrypted to KeyStore', signer.privateKey)

  logOutPut(
    'Account.encrypted also show encryption state is:',
    signer.encrypted
  )

  // 5. you can print out Account address.

  logOutPut('Account address is:', signer.address)

  // 6. but to user, you had better show them checksumAddress

  logOutPut('Account checksumAddress is:', signer.checksumAddress)

  // 7. now you can save account name, account address to local storage.
  // note: NEVER store privatekey to local storage

  const accountInfo = {
    accountName,
    address: signer.checksumAddress
  }

  logOutPut('Account is to be saved:', accountInfo)

  // now if you want to get account instance from wallet
  // use Wallet.getAccount(address:string)
  // we just use accountInfo object above as query

  const foundAccount = harmony.wallet.getAccount(accountInfo.address)

  logOutPut('Account is found:', foundAccount)

  // whenever you want to encrypt an acount
  // use Wallet.decryptAccount(address:string,password:string)

  logOutPut('Signer is to encrypted:', harmony.wallet.signer.privateKey)

  await harmony.wallet.decryptAccount(
    harmony.wallet.signer.address,
    'MyVeryStrongPassword'
  )

  logOutPut(
    'Account is now decrypted, you got the private key:',
    harmony.wallet.signer.privateKey
  )

  // you can remove account from Wallet
  // but remember to delete localstorage as well
  // use Wallet.removeAccount(address:string)

  harmony.wallet.removeAccount(harmony.wallet.signer.address)

  logOutPut('wallet is cleaned up', harmony.wallet.accounts)
}

async function importAccount() {
  // now this case is to demostrate how you can import account
  // there are 3 ways to import an account.
  // 1. privatekey
  // 2. keyStore json
  // 3. phrases

  // we first to demostrate the privatekey
  // suppose you have a private key

  const myPrivateKeyDontWantAnyOneKnows =
    '0x26f645bc650c3146f360b6288c15afe85f383337627bb6995c4b0646b47664ec'

  harmony.wallet.addByPrivateKey(myPrivateKeyDontWantAnyOneKnows)

  logOutPut('private key imported', harmony.wallet.signer)

  // now we remove that

  harmony.wallet.removeAccount(harmony.wallet.signer.address)

  // suppose you have a keystore json

  const keyStore =
    '{"version":3,"id":"38313637-3337-4538-b462-376163353635","address":"de0405903558e82cbd8db5576fc9d4d33e45583b","Crypto":{"ciphertext":"d76606d818731e2900e31473e3742ea64a428846f5c2d8e321d3fdfc1b09e7ce","cipherparams":{"iv":"a498d8d9a14a626ef0f59cc3452d5d6c"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"salt":"9639bc67b40941f4e273690dc8e35278f82a172ec6ee30543f7d5db482ca8539","n":8192,"r":8,"p":1,"dklen":32},"mac":"57f1b2ec56e41fb610c6240d0a40b0b2f3c42c08dbcfc304c1788463413cc9c4"}}'

  await harmony.wallet.addByKeyStore(keyStore, 'MyVeryStrongPassword')

  logOutPut('keystore imported', harmony.wallet.signer)

  harmony.wallet.removeAccount(harmony.wallet.signer.address)

  const phrase =
    'minute mean wheel loan fitness pear marriage sample analyst flame like wrong'

  harmony.wallet.addByMnemonic(phrase)

  logOutPut('phrase imported', harmony.wallet.signer)

  harmony.wallet.removeAccount(harmony.wallet.signer.address)

  logOutPut('wallet is cleaned up', harmony.wallet.accounts)
}

async function main() {
  // await createAccount()
  // await importAccount()

  const address = harmony.crypto.getAddress(
    'one1zksj3evekayy90xt4psrz8h6j2v3hla4qwz4ur'
  ).checksum
  logOutPut('address', address)
}

main()

function logOutPut(title, content) {
  console.log(
    '---------------------------------------------------------------------'
  )
  console.log(`==> Log: ${title}`)
  console.log(
    '---------------------------------------------------------------------'
  )
  console.log()
  console.log(content)
  console.log()
}
