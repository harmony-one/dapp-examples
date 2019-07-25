# Table of Content <!-- omit in toc -->
1. [What is it](#what-is-it)
2. [Very Quick Start](#very-quick-start)
   1. [Build tutorial scripts](#build-tutorial-scripts)
   2. [Deploy example contract](#deploy-example-contract)
   3. [Call example contract function](#call-example-contract-function)
   4. [Alice to Bob transfer](#alice-to-bob-transfer)
3. [Get `Harmony` ready](#get-harmony-ready)
   1. [About the SDK](#about-the-sdk)
   2. [Install `@harmony-js/core`](#install-harmony-jscore)
   3. [Import { Harmony } from '@harmony-js/core`](#import--harmony--from-harmony-jscore)
   4. [Import phrases to Wallet](#import-phrases-to-wallet)
   5. [Put it all together](#put-it-all-together)
4. [Compiling Job](#compiling-job)
   1. [Compile with `solcjs` or `truffle.js` (Skippable)](#compile-with-solcjs-or-trufflejs-skippable)
   2. [Import `fs` `path` and `solc` first](#import-fs-path-and-solc-first)
   3. [Locate FileName and get path(s)](#locate-filename-and-get-paths)
   4. [Get `solc` to work](#get-solc-to-work)
   5. [Export the main compiling function](#export-the-main-compiling-function)
5. [Contract Deployment](#contract-deployment)
   1. [Create contract instance and set params](#create-contract-instance-and-set-params)
   2. [Deploy and listening Transaction events](#deploy-and-listening-transaction-events)
6. [Contract Call](#contract-call)
   1. [Pick a method](#pick-a-method)
   2. [Make the call](#make-the-call)
7. [Address to address transaction](#address-to-address-transaction)
   1. [Construct a `Transaction`](#construct-a-transaction)
   2. [Sign with `Account`](#sign-with-account)
   3. [Send it to blockchain](#send-it-to-blockchain)
   4. [Confirm the result](#confirm-the-result)


# What is it

This is a quick tutorial to guide you how to deploy a smart contract and send some transaction.
Althogh we have already had the `Harmony-js` sdk, which is similar to `web3.js` or `ethers.js`, when it comes to DApp developement.
There are still steps to clearify, hope you can follow these steps and make things easier.

In this tutorial, we use nodejs and web-explorer to complete the process. We require enviorments as follows:

* Node.js 10+ and latest `npm` and `yarn`
* Harmony's repository cloned to your computer

After you clone this repo, please install all dependencies first.

```bash
yarn install && cd tutorial
```
# Very Quick Start

If you want to test how to deploy a contract, and see if it works, you can do it right now.

**Note: the tutorial use Ethereum's Testnet and for demostration only, do not use any of these code to production and Mainnet directly.**

## Build tutorial scripts
The scripts are written in `es6/7`, standard node enviorment would not be able to run, first enter the repo root, then run

```bash
yarn build:tutorial && cd tutorial/build
```

## Deploy example contract

Use default `node` command to deploy, 
* `-f` to sepecify the location of `.sol` file(relative path to the `build` folder),
* `-l` speicify the `gasLimit` in wei, 
* `-p` specify the `gasPrice` in Gwei

```bash
node deploy.js -f ../contracts/example/MyContract.sol -l 840000 -p 100
```

**Note: if your contract has some alter state function, you should increase the `gasLimit`, otherwise the contract cannot be deployed**

After a few minutes (about 3-4 mins, depends on Ropsten's speed ), you can see a `.json` file is located in the `tutorial/contracts/example/`, named with `MyContract-0xxxxxx-.json`, open it and you can see a json like:

```json

{
  "contractCode": "0x...",
  "contractAddress": "0xe996cD26A3b77dD733cBec92dd61169307ca848a",
  "timeStamp": "2019-07-11T08:32:35.247Z"
}
```
Now **copy** the `contractAddress`'s value. We use it for calling.

Also you can find another `.json` file name `MyContract.json` with no `-0x....`, which complier generate.

We will also use it later.

In this example, the contract is deployed to `0xe996cD26A3b77dD733cBec92dd61169307ca848a`, you can see it in 

[https://ropsten.etherscan.io/address/0xe996cD26A3b77dD733cBec92dd61169307ca848a](https://ropsten.etherscan.io/address/0xe996cD26A3b77dD733cBec92dd61169307ca848a)


## Call example contract function

**Go to `bulid` folder** in your console, no need to type in `-f` options, use space to split the parameters, like this:

Use default `node` command to deploy, 
* `-f` to sepecify the location of `.json` file(relative path to the `build` folder),
* `-a` speicify the deployed contract address, 
* `-j` specify the deployed contract `.json` file

```
node call.js  -f <compiler-output.json> -a <contractAddress>
```

In this case, that will be:

```bash
node call.js -f ../contracts/example/MyContract.json -a 0xe996cD26A3b77dD733cBec92dd61169307ca848a
```

You should be able to see output in your console:

```bash
{ callResult:
   { '0': '23456',
     '1': 'Hello!%',
     myNumber: '23456',
     myString: 'Hello!%' },
  callResponseHex:
   '0x0000000000000000000000000000000000000000000000000000000000005ba00000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000748656c6c6f212500000000000000000000000000000000000000000000000000',
  callPayload:
   { from: '0x1a3e7a44ee21101d7d64fbf29b0f6f1fc295f723',
     to: '0x59C5a8Ce880463DB9505CAc3f7966925F036fd2b',
     gas: '0x33450',
     gasPrice: '0x2540be400',
     value: '0x0',
     data: '0x13bdfacd',
     nonce: '0x1a' } }

```

Now you have complete the quick start.If you are interested how it works, and how to use `Harmony`'s sdk, please reference with following content.

## Alice to Bob transfer

Transfer token from one to another

**Note: We use demo account of Ropsten**


Use default `node` command to deploy, 
* `-t` to sepecify receipiant's address, either base16(checksum) or bech32 with `one1` prefix,
* `-a` to speicify transfer value in wei,
* `-l` speicify the `gasLimit` in wei, 210000 by default
* `-p` specify the `gasPrice` in Gwei, 100 by default
* `-n` speicify the `nonce` if you want to override the pending transaction or handle it mannually. 

```bash
## go to build folder
cd tutorial/build 
## make the transfer
node transfer.js --to 0xf2a08313fc79a01adbc5e700b063ed83ed07b446 -a 1234567 
```
After 1-2 minutes, depending on the finalty.

You should be able to see output looks like this

```bash
---- Transaction Summary ----

Transfer  From   : one1d7ey2z8xx8h5turmg3u5ucmntxucq9ltd5f0n3
       (CheckSum): 0x6Fb24508e631Ef45f07B44794e637359b98017EB
Transfer  To     : one172sgxylu0xsp4k79uuqtqclds0ks0dzxqqfdlm
       (CheckSum): 0xF2A08313FC79A01AdbC5E700B063ed83Ed07B446

---- Balance Before Sent ----

Balance before   : 519635891059992965 wei

---- Balance Deduction ----

Transfer Amount  : 1234567 wei
Transaction Fee  : 2100000000000000 wei
Sub Total        : 2100000001234567 wei

---- Balance After Sent ----

Balance after    : 517535891058758398 wei

For detail, you can refer to: 
https://ropsten.etherscan.io/tx/0xf2e1475d3d0b1132a257268d6af35af0a2ebe0b6ff36c113538624c2f03a8c86
```




# Get `Harmony` ready
## About the SDK

In Harmony's blockchain, we have multiple `RPC Methods` to interact with. But there are a lot of things before we use rpc, like Account management, Transaction signing, Contract initializing, Events, .etc. That's why we make the SDK(s), we hope to make all executions to be higher level,  for developer(s) to make their Apps much easier.

We use `Harmony` as our main instance, if you dont want to make every low level developement, just use `Harmony` instance, and pass with `url` and a few `options`, things get easier.

In this tutorial, we have a file that initializing `Harmony` instance, please do locate it here `tutorial/src/harmony.js`.

We will explain it in the following section.

## Install `@harmony-js/core`

If you have already install it from repo root,  if you haven't, just run:

```bash
yarn add @harmony-js/core@next
```
The sdk is contantly update, we add the `@next` tag to npm. You can upgrade the sdk easily with following command:

```bash
yarn upgrade @harmony-js/core@next
```

## Import { Harmony } from '@harmony-js/core`
Now go to `tutorial/src/harmony.js`
First import `@harmony-js/core` and `@harmony-js/utils`

```javascript
import { Harmony } from '@harmony-js/core'
import { ChainType, ChainID } from '@harmony-js/utils'
```
The Harmony is a class, if you use `typescript` you can reference all types easily:

```typescript
// to initializing Harmony instance
new Harmony(url: string, config: HarmonyConfig)

interface HarmonyConfig {
  chainUrl: string;
  chainType: ChainType;
  chainId: ChainID;
}

const enum ChainType {
  Harmony = 'hmy',
  Ethereum = 'eth',
}

const enum ChainID {
  Default = 0,
  EthMainnet = 1,
  Morden = 2,
  Ropsten = 3,
  Rinkeby = 4,
  RootstockMainnet = 30,
  RootstockTestnet = 31,
  Kovan = 42,
  EtcMainnet = 61,
  EtcTestnet = 62,
  Geth = 1337,
}
```
If you are not using `typescript`, don't worry, it's easy, like this way:

```javascript
const harmony =

 new Harmony(
     'https://localhost:9500',
     // the url indicate the rpc service enabled
     // either `hmy` testnet or running locally,
     // or you can use Ethereum's service like Infura provides
        { 
         chainId:0, 
         // default is 0, please reference with ChainID
         chainType:'hmy' 
         // default is `hmy`, 
         // simply change it to `eth` to test with `Ethereum` 
        }
    )
```

Now you can access all `Harmony` instance provides, including all neccesary functionalities like `Wallet`, `Transactions`,`Contract` and `Blockchain`, all funcionalities will be documented in `Harmony-sdk-core` ( we are busy developing and testing, so docs will be done in a few weeks ).

## Import phrases to Wallet
After you had `Harmony` instance ready, you are able to add your `privateKey` to your `Wallet`. In this example, we use standard `12-words-mnemonics` and `index` according to `BIP39` and `BIP44` , which are widely used in Blockchain and Crypto community.

You can see these phrases and index number are your privateKey(s), whenever they are imported to `Wallet`, your privateKey(s) are recovered. So save them safely, and don't let anybody knows. 

To add phrase to Wallet, simply do this:

```javascript
// standard phrases
const phrases = 'food response winner warfare indicate visual hundred toilet jealous okay relief tornado'

// default index = 0, each index will specify different privateKey
const index = 0

// use `harmony.wallet.addByMnemonic` to get your account ready to your wallet
const myAccount = harmony.wallet.addByMnemonic(phrases, index)

```

In this tutorial, please **MAKE SURE** your private key have some balance. You can use `tutorial/phrase.txt` as your testing account, which has some token in `Ropsten of Ethereum`. Or you can edit the file using your own.

**Note: If we have faucet in Harmony's testNet, the process will go easier** 

For those who have privateKey(which is hex string with 66 length), you can use privateKey directly, like this

```javascript

// use your private key or load it from local file
const privateKey = '0x........'

// use `Harmony.wallet.addByPrivateKey(key:string)`
// to import your key and get the Account instance
const myAccount = harmony.wallet.addByPrivateKey(privateKey)
```



## Put it all together
Now in `tutorial/src/harmony.js`, we import `phrases.txt` as `utf8` string to be our mnemonic phrases, and we use a `setting.json` to save our setting for `url`,`ChainID`, and `ChainType`.

So we import `fs` as local file loader to load these settings.  The entire script looks like this:

```javascript
import fs from 'fs'
import { Harmony } from '@harmony-js/core'
import { ChainType, ChainID } from '@harmony-js/utils'

// loading setting from local json file
const setting = JSON.parse(fs.readFileSync('../setting.json'))

// initializing Harmony instance
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

```

# Compiling Job
## Compile with `solcjs` or `truffle.js` (Skippable)

`Harmony` supports smart contract written in Solidity(.sol). 
Usually, developer use local complier or tools to compile the raw code instead of compile it online. Such as `truffle.js` or `solcjs` to do the job.

In this tutorial, we use `solcjs` as extra tool to complete job, because `solcjs` is too big to be included in sdk. In the future version of Harmony's toolings for developers, we plan to make an `All-In-One` suite to ease your ( and our ) pain.

We have written some smart contract in Solidity, you can locate them in `tutorial/contracts` folder.

In this example, we use `tutorial/contracts/example/MyContract.sol` to demostrate. It's a very simple and have a static function. It works like a `hello world` function, nothing special.

```solidity
pragma solidity ^0.5.1;


contract MyContract {
    function myFunction() public returns(uint256 myNumber, string memory myString) {
        return (23456, "Hello!%");
    }
}
```
Now we have our raw contract ready, then we use `solcjs` to complie it before we deploy.

`solcjs` is an excellent tool, you can use it to `hack` your contract with customizing methods. But we don't want increasing the complexity, we simply write a small script to compile the contract. If you can learn more about it, you can reference [ethereum/solc-js](https://github.com/ethereum/solc-js)

`/tutorial/src/compile.js`

Now we try to let you understand how it works quickly, if you are already familiar with `solc` or `truffle` , just use them directly and **SKIP** this part


## Import `fs` `path` and `solc` first
```javascript

import fs from 'fs'
import path from 'path'
import solc from 'solc'

```
## Locate FileName and get path(s) 
suppose we have a contract with a realtive path, like `../contracts/example/MyContract.sol`.

We simply use it as input params, and get all relative and absolute path for this file, here we have `getFileNameAndPath` and `getPaths` to do the job. They dont do much magic but they will work together with `solc` compiler later.

```javascript
export function getFileNameAndPath(file) {
  const locationArray = file.split('/')

  const fileIndex = locationArray.findIndex(
    val => val.substring(val.length - 4, val.length) === '.sol'
  )

  const fileName = locationArray[fileIndex]
  const filePath = locationArray.slice(0, fileIndex)

  return {
    fileName,
    filePath
  }
}

export function getPaths(filePath, fileName, importFile) {
  const relativePath = path.join(...filePath)
  const absolutePath = path.resolve(relativePath)
  const fullRelativePath = path.join(relativePath, fileName)
  const fullAbsolutePath = path.join(absolutePath, fileName)
  const importPath = importFile
    ? path.join(fullRelativePath, '../', importFile)
    : ''
  const importAbsolutePath = path.resolve(importPath)
  return {
    filePath,
    fileName,
    relativePath,
    absolutePath,
    fullRelativePath,
    fullAbsolutePath,
    importPath,
    importAbsolutePath
  }
}
```

## Get `solc` to work
   
Here we use `path` and `file` to consturct a `solc` specific object, you can reference [solc-usage-in-projects](https://github.com/ethereum/solc-js/blob/master/README.md#usage-in-projects) 

Additionly, we use a `findImport` function to identify if contract is importing another `.sol`, the complier will locate the file correctly. Same above, nothing magically. 

```javascript
export function constructInput(fullRelativePath, file) {
  const content = fs.readFileSync(fullRelativePath, {
    encoding: 'utf8'
  })
  const input = {
    language: 'Solidity',
    sources: {},
    settings: {
      outputSelection: {
        '*': {
          '*': ['*']
        }
      }
    }
  }

  input.sources[file] = { content }
  return JSON.stringify(input)
}

// Use it if contract have other importions
export function findImport(importPath) {
  const testPath = getFileNameAndPath(
    path.join('../', contractFolder, importPath)
  )
  const paths = getPaths(testPath.filePath, testPath.fileName)
  const contents = fs.readFileSync(paths.fullAbsolutePath, {
    encoding: 'utf8'
  })
  return { contents }
}
```

## Export the main compiling function
   
Unlike `truffle.js`, we don't need all the complile process to hack and we only need the `abi` and `bin` to deploy. 

Here we save them to json file locally. but you dont need them if you are confident enough.

```javascript

export function compileContract(
  fileLocation,
  jsonFile,
  contractFolder = 'contracts'
) {
  const location = getFileNameAndPath(fileLocation)
  const paths = getPaths(location.filePath, location.fileName)

  // now we get the output
  const output = JSON.parse(
    solc.compile(
      constructInput(paths.fullRelativePath, paths.fileName),
      findImport
    )
  )

  let abi
  let bin

  for (var contractName in output.contracts[paths.fileName]) {
    let contractAbi = output.contracts[paths.fileName][contractName].abi
    let contractBin =
      output.contracts[paths.fileName][contractName].evm.bytecode.object
    if (contractAbi) {
      abi = contractAbi
    }
    if (contractBin) {
      bin = contractBin
    }
  }

  const savedJson = JSON.stringify({ abi, bin })
  const jsonLocation =
    jsonFile ||
    `${paths.relativePath}/${paths.fileName.replace('.sol', '.json')}`

  if (jsonFile) {
    fs.writeFileSync(jsonLocation, savedJson)
  }
  return {
    abi,
    bin,
    jsonLocation
  }
}

```


# Contract Deployment
 In Blockchain, `Contract` is running as binary. In the previous section, we talk about compiling process and we had generate the `abi` and `bin` with json using `solc`, and also you can use `truffle` to do the same job.

 Next we send the binary code to the Blockchain, just like a `Transaction`. In the meantime, the SDK provides `Contract` instance to simplify the process.

 In this tutorial, we use `tutorial/src/deploy.js` to demostrate how the process is done.

 ## Get abi and bin from compiler

 If you had read previous section, you will notice that the 
 `compileContract` function will return a JS Object,like

 ```javascript
 {
     bin,
     abi,
     jsonLocation
 }

 ```
 So you can get them using:

 ```javascript

 import {compileContract} from './compile'

 // Relative path of '.sol' file

 const file = 'contract file'

// Relative path of `compiled-output.json` to save
// By default in `compileContract` it has the same name with the contract name
// e.g `MyContract.sol` will be compiled to `MyContract.json`

 const compileTo = '...'

 const { abi, bin } = compileContract(file, compileTo)

 // the abi and bin will be the result you want

 ```

## Create contract instance and set params

**Note: Because we are using SDK, all the inside-job are done by interally, here we only demostrate how Contract is created and parameters are set**

In SDK, we can use `Harmony.contracts.createContract` to create a contract instance, using `abi` as input. Since we had get our `Harmony` instance ready from previous section. we can import it here.

```javascript
import { harmony, myAccount } from './harmony'

//...

const myContract = harmony.contracts.createContract(abi)

```
After the `Contract` is created by `Factory Method - Harmony.contracts`, the `abi` is shipped in, and you should be able to deploy and call.


Now you have to specify the `Transacation` object. The `Transaction` is a class that defined in SDK, to initializing a `Transaction`, some parameters have to set as input.


You can reference the `typescript` definition, which is as follow:

```typescript

interface TxParams {
  id: string;
  from: string;
  to: string;
  nonce: number | string;
  gasLimit: BN;
  gasPrice: BN;
  shardID: number | string;
  toShardID: number | string;
  data: string;
  value: BN;
  chainId: number;
  txnHash: string;
  unsignedTxnHash: string;
  signature: Signature;
  receipt?: TransasctionReceipt;
}
```

But we don't need that much input, all the `TxParams` will be set a default value to `Transaction`. We just need some of them, like `gasLimit` and `gasPrice` in this example.

Remember, `gasLimit` and `gasPrice` in SDK, we defined it as `BN` interally, to that, the big number input won't break our function.

Also we use `Unit` as our conversion tool to simplify the process. You can see `gasPrice` here is defined `asGwei()` means you input `100` Gwei(string) and use `toWei()` later, the result will be `100000000000` in wei (BN)

```javascript
const txnObj = {
    // gasLimit defines the max value that blockchain will consume

    // here we show that you can use Unit as calculator
    // because we use BN as our save integer as default input
    // use Unit converter is much safer
    gasLimit: new harmony.utils.Unit(gasLimit).asWei().toWei(),

    // gasPrice defines how many weis should be consumed each gas
    // you can use `new BN(string)` directly,
    // if you are sure about the amount is calculated in `wei`
    gasPrice: new harmony.utils.Unit(gasPrice).asGwei().toWei()
  }
```

What about `bin`? it is also needed, but in the `Contract.deploy` , now comes the follow step

## Deploy and listening Transaction events

This step will deploy the Contract to blockchain, and in the meantime, you can see `Transaction` events throughout the process.

We had already create a contract , and defined the `Transaction` object. Now we use `Contract.deploy()` to make it work. 

`deploy` function accepts `data` and `arguments`

- The `data` is the `bin` you get previously, remember, it has to be compiled and with `0x` prefix.
- The `arguments` is defined by contract you want to deploy, normally we don't need to specify here, but for complex Contract, you should input here. In this example, we don't do that.



```typescript

Contract.deploy( { data:string, arguments:any[] } )

```

Then you remember to use `.send(TxParams)` to input the Transaction parameters.

So it will work like this

```javascript
Contract.deploy({data:`0x${bin}`,arguments:[]}).send(txObj)
```

Here are what happen in detail:

- `bin` and `arguments` will be combined by automatically and internally
- `TxParams` is used to consturct a `Transaction`
- After that, the `Account` that added to `Harmony.Wallet` as `Signer` is used to sign the `Transaction` into bytecode, which works internally.
- When the `Transaction` is signed, it will be send to blockchain via `RPC Method` through the `url` we set for `Harmony` instance. Which is also done interally.


Remember, It's a **async** function, and before the `Promise` returns, it works like a `EventEmitter`. Only after the contract is deployed or rejected, the `Prmoise<Contract>` will be returned.


It works like this way.

```typescript



    Contract
    .deploy({
      data: `0x${bin}`,
      arguments: []
    })
    .send(txnObj)
    // from this on, we got the `Emitter`, it works like `EventEmitter`
    // use `.on(e:TransactionEvents,callback)` to execute 
    .on('transactionHash', transactionHash => {
        // do with transactionHash
    })
    .on('receipt', receipt => {
        // do with receipt
    })
    .on('confirmation', confirmation => {
        // do with confirmation
    })
    .on('error', error => {
        // do with error
    })
    // after then, the async result will be Returned
    .then( DeployedContract => {
        // Now the Prmoise<Contract> is Returned
    })

    // The TransactionEvents defines what events will be returned
    // by Emitter

    enum TransactionEvents {
        transactionHash = 'transactionHash',
        error = 'error',
        confirmation = 'confirmation',
        receipt = 'receipt',
    }


```

In `tutorial/src/deploy.js`, we also have other functions made, for example `checkMyAccount`, in case our `Account` doesn't have enough token to deploy contracts or make transactions. It simply do `Account.getBalance` job and return boolean, you can write your own.


After the `Contract` is deployed, we may get the `Contract` code(bytes) on blockchain, we can use query method to do that. Use `Contract.address` as input, and use `Harmony.blockchain.getCode` to get the code.

```javascript

    // ...async function

    // `deployed` is deployed Contract
    // `Contract.address` will be its contract address
    const contractAddress = deployed.address
    // and get the contract byte code that deployed to blockchain
    const contractCode = await harmony.blockchain.getCode({
      address: deployed.address
    })

    // and we may wanna return it them as result

    return  {
        contractCode,
        contractAddress,
    }


```

Finally, we can save all the deployed information needed for the next step. Simply save it as `.json` file, and use its address as file name. In this case, it's `MyContract-0xxxxxxx-.json`

```typescript

    const { contractCode, contractAddress } = result

    fs.writeFileSync(
      path.resolve(file.replace('.sol', `-${contractAddress}.json`)),
      JSON.stringify({
        contractCode,
        contractAddress,
        timeStamp: new Date().toJSON()
      })
    )

```
Sure you can save them to database or return them for other functions to use, but for demostration only, we do it this way.

Now If you had deploy contract successfully, you will be able to see a new `.json` file appear in the `contracts/example` folder.

We will need these information to call the contract method later.


# Contract Call

Contract deployed to blockchain is a binary lives in the network. You can see it as `App` that lives in your computer or smartphone. If someone call the function or make some transaction to the address, it may alter the contract's state or make it running.

There are 2 types of interaction to the smart contract

- State-Altering
- Non-State-Altering

`State-Altering` means if you call the method of the contract code/function, it will execute and change the state, such as balance state, or something related to blockchain data. It will consume some gas, affect caller's balance and others.

`Non-State-Altering` means if you call the method of the contract code/function, it would not change the state of the blockchain data. You can see it as static return ,like `hello world`. These function would not affect the blockchain but simply return the result. It will not consume gas, would not affect caller's balance or anyone else.

Both types of functions are defined by SmartContract itself(by developer). So you had better read the contract code, before you make the method calls.

In this tutorial, we simply use a `Non-State-Altering` method call to the simple Contract we deployed.

## Pick a method

Just for recap, here is the code of `MyContract`

```solidity
pragma solidity ^0.5.1;


contract MyContract {
    function myFunction() public returns(uint256 myNumber, string memory myString) {
        return (23456, "Hello!%");
    }
}

```

This contract has a single method call `myFunction`, if we make a method call, it will return static result which is `23456` and `Hello!%`. It would not affect the balance or anyone else's balance or blockchain data.

Do you remember how we initial the `Contract` instance? We use `harmony.contracts.createContract(abi)` to create a contract instance. The `abi` here is basically the function name and parameters types and events extracted by `solc` compiler.

It's been injected inside the `Contract` instance. All methods extracted by compiler are placed at `Contract.methods`, and events are placed at `Contract.events`.

In javascript, we can simply call a method use `Contract.methods.MethodName` to do the job. For this `MyContract` example, we will do it like:

```javascript
 // see myFunction is defined by `MyContract.sol`
 // which have no parameters to input
 Contract.methods.myFunction()
```

## Make the call

Previously, we had:

- abi and bin(saved to json file)
- deployed contract address(saved to json file)
- picked a method and know its signature(No parameters of `myFunction`)

Now we are able to make the contract call.

Before that, we'd better use another `Contract` instance, to prevent that call result affect our original one. This we pass the `abi` and the `contractAddress`, tell the instance that we had a depoyed contract with the `abi` and address.


```javascript
  const deployedContract = harmony.contracts.createContract(
    abi,
    contractAddress
  )
```

Then we can make the call, use `.call()` after the `myFunction()`, to tell the sdk to call the method to the blockchain. This process is `async`, so we use `async/await` or `Prmoise.then` to get the result. 

```javascript
 const reuslt=await deployedContract.methods.myFunction().call()
```

The whole method call looks like this:

```javascript
async function callContract(abi, contractAddress) {
  const deployedContract = harmony.contracts.createContract(
    abi,
    contractAddress
  )
  const callResult = await deployedContract.methods.myFunction().call()
  return callResult
}

```

For the final part, if we had `callResult`, we just log it out to console or return it to other functions. Here we just simply do the `console.log`

Now if you had call the `MyContract.methods.myFunction`, it will display the result like this:

```bash
{ '0': '23456',
  '1': 'Hello!%',
  myNumber: '23456',
  myString: 'Hello!%' }
```

# Address to address transaction

In blockchain, transfering tokens from one address to another is the most usual use-case. We call that `A-to-B Transaction`.

To complete the process, the sender has to know least facts below:

- Address of receipiant, `to`
- Value to send, `value`
- GasLimit that we are willing to afford, `gasLimit`
- GasPrice that we accept, `gasPrice`

We can construct a `Transaction` using SDK, and use `Account` to sign then send it to blockchain.

This tutorial demostrate a simple transaction process in `tutorial/src/transfer.js`

## Construct a `Transaction`
Every `Transaction` needs some parameters to initialize, in the SDK, `Transaction` is also a class.

It should be initialize with `TxParams`,`Messenger`,`TxStatus`. It's signature looks like this:

```typescript

Transaction(params:TxParams, messenger: Messenger, txStatus:TxStatus)
```

However, when it comes to real developement, we don't want to do that everytime. Since SDK has factory class to do the job, called `TransactionFactory`, which can be access when `Harmony` instance is initialized.

We simply use `Harmony.transactions` to create `Transaction`, which you only need to input some of the `TxParams`.

You can reference `TxParams` below:

```typescript

interface TxParams {
  id: string;
  from: string;
  to: string;
  nonce: number | string;
  gasLimit: BN;
  gasPrice: BN;
  shardID: number | string;
  toShardID: number | string;
  data: string;
  value: BN;
  chainId: number;
  txnHash: string;
  unsignedTxnHash: string;
  signature: Signature;
  receipt?: TransasctionReceipt;
}
```
Normally for `address-to-address` transaction , we only need `to`,`gasLimit`,`gasPrice`,`value` to finish the job.

So the code looks like this:

```javascript

harmony.transactions.newTx({
  to:...,
  gasLimit:...,
  gasPrice:...,
  value:...,
})

```
**Please Remember**, `gasLimit`,`gasPrice`,and `value`,is defined as `BN`, because "The Number.MAX_SAFE_INTEGER constant represents the maximum safe integer in JavaScript (253 - 1)". To that, we need to input `BN` to those parameters.

And for `Ethereum` and `Harmony` blockchain, they also have the idea of `unit` , such as `wei`,`gwei`,`ether`,`gether`,.etc. The `gasLimit`,`gasPrice` and `value` have to converted to `wei`.

We don't want to calculate by hand. So in SDK, we also have a tool called `Unit`. We can use it to convert the value easily.

See the usage below:

```javascript

// suppose we have 100 Ether to input
const value = '100'

const valueBN = new harmony.utils.Unit(value).asEther().toWei()
// now valueBN is typeof `BN`, and it's value is converted to `wei`

```

Now here is how it goes:

```javascript

// suppose we have 100 Ether to input
const txn= harmony.transactions.newTx({
  to:'address to input',
  gasLimit: new harmony.utils.Unit('210').asKwei().toWei(),
  gasPrice: new harmony.utils.Unit('100').asGwei().toWei(),
  value: new harmony.utils.Unit('1').asEther().toWei(),
})

```

Now about the `Address`, both `Ethereum` and `Harmony` blockchain define `Address` to be format of `base16` internally, and it's checksumed. It looks like this:

```javascript
  0x9504DACe66266ed0C341D048566C01537ac318f5
```

However, it's not easy for user to understand these format and hard to read and tell the difference between different blockchain.

So in `Harmony`, we use `bech32` format and `one1` prefix to define the `Address`. In SDK, we also have a tool to convert those format back and forward.

```javascript
const base16Checksum='0x9504DACe66266ed0C341D048566C01537ac318f5'

const bech32Address= harmony.crypto.getAddress(base16Checksum).bech32

// bech32Address is 'one1j5zd4nnxyehdps6p6py9vmqp2davxx84qwvkj8'

const bech32ToChecksum=harmony.crypto.getAddress(bech32Address).checksum

console.log( base16Checksum === bech32ToChecksum )

// true

```

In SDK, when you construct a Transaction, only `checksum` or `bech32` format is allowed, to prevent user input address incorrectly.

Enough said, we just create a `Transaction` right away.

```javascript

const txn= harmony.transactions.newTx({
  to:'one1j5zd4nnxyehdps6p6py9vmqp2davxx84qwvkj8',
  gasLimit: new harmony.utils.Unit('210').asKwei().toWei(),
  gasPrice: new harmony.utils.Unit('100').asGwei().toWei(),
  value: new harmony.utils.Unit('1').asEther().toWei(),
})

```

## Sign with `Account`

Every transaction is needed a `Account` to Signed.

Remember how we add phrase to `Wallet`, that `Account` imported will be the `Signer` to do the signing job.

Because many user use different `Account` to transfer token, but rarely use `Account` to deploy contract. So in SDK, we require `Transaction` is signed everytime. The process is like this way:

```javascript
const signedTxn = await Account.signTransaction(Transaction, ...options)
```

**Please noted**, the signing process is an `async` function, because in reality, to prevent `double spend attack`, we need to request `AccountState` from blockchain, and get `nonce` of it. After the correct `nonce` is fetched and signed with the bytecode, and the `Transaction` will not be rejected by blockchain. However if the `Transaction` is in `Pending` state, you can override the transaction passing the `Pending` nonce to it.

We sign the transaction we constructed previously, and we use the signed one later.

```javascript
import {myAccount} from '../harmony'

//....

const signed= await myAccount.signTransaction(txn)

```
You have sign the `Transaction`, that you can see if it is signed using `Transaction.isSigned()`, and you can see `Transaction.signature` if it is displayed as a long hex string with `0x` to it.

```javascript

  const isSigned = signed.isSigned()

  // true

  console.log(isSigned.signature)

  // `0x${long hex string}`

```
Now you get your `Transaction` signed, ready for sending.

## Send it to blockchain

There a few ways to send a transaction to blockchain. If you are familiar with `Ethereum`, you can use `eth_sendTransaction` or `eth_sendRawTransaction` to do the job. Also in `Web3.js`, you can use `web3.eth.send()` to do that.

In the SDK, we can do it by `Harmony.blockchain.sendTransaction()` similar to `web3.eth.send()`, or by `Transaction.sendTransaction()` to simplify the process.

Also, if you like to listen to `events`, you can use `harmony.blockchain.createObservedTransaction()` to do it. Because the transaction may or may not be accepted by blockchain, we may want to listen to `events` throughout the process to identify if something goes wrong , without waiting the finalty of blockchain.

In this tutorial, we use `createObserverdTransaction` to do the job.

If you had read [Deploy and listening Transaction events](#Deploy-and-listening-Transaction-events), you can find it same with here.

One function will finished the sending job, but you may wanna know the `event` listener works. And you can do other executions in the `callback`.

```javascript

const sentTxn = await harmony.blockchain
      .createObservedTransaction(signed)
      .on('transactionHash', transactionHash => {
        console.log(`-- hint: we got Transaction Hash`)
        console.log(``)
        console.log(`${transactionHash}`)
        console.log(``)
        console.log(``)

        harmony.blockchain
          .getTransactionByHash({
            txnHash: transactionHash
          })
          .then(res => {
            console.log(`-- hint: we got transaction detail`)
            console.log(``)
            console.log(res)
            console.log(``)
            console.log(``)
          })
      })
      // when we get receipt, it will emmit
      .on('receipt', receipt => {
        console.log(`-- hint: we got transaction receipt`)
        console.log(``)
        console.log(receipt)
        console.log(``)
        console.log(``)
      })
      // the http and websocket provider will be poll result and try get confirmation from time to time.
      // when `confirmation` comes in, it will be emitted
      .on('confirmation', confirmation => {
        console.log(`-- hint: the transaction is`)
        console.log(``)
        console.log(confirmation)
        console.log(``)
        console.log(``)
      })
      // if something wrong happens, the error will be emitted
      .on('error', error => {
        console.log(`-- hint: something wrong happens`)
        console.log(``)
        console.log(error)
        console.log(``)
        console.log(``)
      })

```

## Confirm the result

After sending, you will get a `transactionHash` instantly, which is calculated by the `nonce` and `publicKey` of your account. It's like a `id` that you can request to blockchain to see if the `Transaction` is accepted or rejected.

So that `id` doesn't mean that the transaction is successful. Only you get the `transaction receipt` is the confirmed result. Like the way you buy a coke from 7-eleven, the guy from counter will give you a receipt after he receive your money.





