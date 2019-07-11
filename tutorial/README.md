# Table of Content <!-- omit in toc -->
1. [What is it](#What-is-it)
2. [Contract deployment steps](#Contract-deployment-steps)
   1. [Compile with `solcjs` or `truffle.js`](#Compile-with-solcjs-or-trufflejs)
      1. [Import `fs` `path` and `solc` first](#Import-fs-path-and-solc-first)
      2. [Locate FileName and get path(s)](#Locate-FileName-and-get-paths)
      3. [Get `solc` to work](#Get-solc-to-work)
      4. [Export the main compiling function](#Export-the-main-compiling-function)
   2. [Get `Harmony` ready](#Get-Harmony-ready)
      1. [Prepare the `Provider` url](#Prepare-the-Provider-url)
      2. [Get your Mnemonic phrase](#Get-your-Mnemonic-phrase)
      3. [All Ready](#All-Ready)
   3. [Construct a new Contract instance and setup transaction object](#Construct-a-new-Contract-instance-and-setup-transaction-object)
   4. [Deploy and remember to save the contract address](#Deploy-and-remember-to-save-the-contract-address)
3. [Contract call steps](#Contract-call-steps)
4. [Address to address transaction](#Address-to-address-transaction)


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

# Contract deployment steps

## Compile with `solcjs` or `truffle.js`

`Harmony` supports smart contract written in Solidity(.sol). 
Usually, developer use local complier or tools to compile the raw code instead of compile it online. Such as `truffle.js` or `solcjs` to do the job.

In this tutorial, we use `solcjs` to complete job, since `solcjs` is too big to be included in sdk. In the future version of Harmony's toolings for developer, we plan to make an `All-In-One` suite to ease your(and ours) pain.

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


### Import `fs` `path` and `solc` first
```javascript

import fs from 'fs'
import path from 'path'
import solc from 'solc'

```
### Locate FileName and get path(s) 
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

### Get `solc` to work
   
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

### Export the main compiling function
   
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


## Get `Harmony` ready

In Harmony's blockchain, we have multiple `RPC Methods` to interact with. But there are a lot of things before we use rpc, like Account management, Transaction signing, Contract initializing, Events, .etc. That's why we make the SDK(s), we hope to make all executions to be higher level,  for developer(s) to make their Apps much easier.

We use `Harmony` as our main instance, if you dont want to make every low level developement, just use `Harmony` instance, and pass with `url` and a few `options`, things get easier.

In this tutorial, we have a file that initializing `Harmony` instance, please do locate it here `tutorial/src/harmony.js`.

We will explain it in the following section.
### Prepare the `Provider` url
** Writing **
### Get your Mnemonic phrase
** Writing **
### All Ready
** Writing **
## Construct a new Contract instance and setup transaction object
** Writing **
## Deploy and remember to save the contract address

# Contract call steps

- Methods and Events
- Use `Contract.methods.xxx` to call

# Address to address transaction
** Writing **

<TBD>
