# Table of Content <!-- omit in toc -->
1. [What is it](#What-is-it)
2. [Very Quick Start](#Very-Quick-Start)
   1. [Build tutorial scripts](#Build-tutorial-scripts)
   2. [Deploy example contract](#Deploy-example-contract)
   3. [Call example contract function](#Call-example-contract-function)
3. [Get `Harmony` ready](#Get-Harmony-ready)
   1. [About the SDK](#About-the-SDK)
   2. [Install `@harmony-js/core`](#Install-harmony-jscore)
   3. [Import { Harmony } from '@harmony-js/core`](#Import--Harmony--from-harmony-jscore)
   4. [Import phrases to Wallet](#Import-phrases-to-Wallet)
   5. [Put it all together](#Put-it-all-together)
4. [Compiling Job](#Compiling-Job)
   1. [Compile with `solcjs` or `truffle.js` (Skippable)](#Compile-with-solcjs-or-trufflejs-Skippable)
   2. [Import `fs` `path` and `solc` first](#Import-fs-path-and-solc-first)
   3. [Locate FileName and get path(s)](#Locate-FileName-and-get-paths)
   4. [Get `solc` to work](#Get-solc-to-work)
   5. [Export the main compiling function](#Export-the-main-compiling-function)
5. [Contract Deployment](#Contract-Deployment)
   1. [Create contract instance and set params](#Create-contract-instance-and-set-params)
   2. [Deploy and listening Transaction events](#Deploy-and-listening-Transaction-events)
6. [Contract Call](#Contract-Call)
   1. [Pick a method](#Pick-a-method)
   2. [Make the call](#Make-the-call)
7. [Address to address transaction](#Address-to-address-transaction)
   1. [Construct a `Transaction`](#Construct-a-Transaction)
   2. [Sign with `Account`](#Sign-with-Account)
   3. [Send it to blockchain](#Send-it-to-blockchain)
   4. [Confirm the result](#Confirm-the-result)


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
node deploy.js -f=../contracts/example/MyContract.sol -l=210000 -p=100
```

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

```
node call.js  <compiler-output.json>  <contractAddress>
```

In this case, that will be:

```bash
node call.js ../contracts/example/MyContract.json 0xe996cD26A3b77dD733cBec92dd61169307ca848a
```

You should be able to see output in your console:

```bash
{ '0': '23456',
  '1': 'Hello!%',
  myNumber: '23456',
  myString: 'Hello!%' }
```

Now you have complete the quick start.If you are interested how it works, and how to use `Harmony`'s sdk, please reference with following content.


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
** writing **
## Sign with `Account`
** writing **
## Send it to blockchain
** writing **
## Confirm the result
** writing **

