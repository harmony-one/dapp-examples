# harmony-sdk-examples

# Install

```bash
yarn install
```

# Tutorial

1. [What is it](https://github.com/FireStack-Lab/harmony-sdk-examples/tree/master/tutorial#What-is-it)
2. [Very Quick Start](https://github.com/FireStack-Lab/harmony-sdk-examples/tree/master/tutorial#Very-Quick-Start)
   1. [Build tutorial scripts](https://github.com/FireStack-Lab/harmony-sdk-examples/tree/master/tutorial#Build-tutorial-scripts)
   2. [Deploy example contract](https://github.com/FireStack-Lab/harmony-sdk-examples/tree/master/tutorial#Deploy-example-contract)
   3. [Call example contract function](https://github.com/FireStack-Lab/harmony-sdk-examples/tree/master/tutorial#Call-example-contract-function)
   4. [Alice to Bob transfer](https://github.com/FireStack-Lab/harmony-sdk-examples/tree/master/tutorial#Alice-to-Bob-transfer)
3. [Get `Harmony` ready](https://github.com/FireStack-Lab/harmony-sdk-examples/tree/master/tutorial#Get-Harmony-ready)
   1. [About the SDK](https://github.com/FireStack-Lab/harmony-sdk-examples/tree/master/tutorial#About-the-SDK)
   2. [Install `@harmony-js/core`](https://github.com/FireStack-Lab/harmony-sdk-examples/tree/master/tutorial#Install-harmony-jscore)
   3. [Import { Harmony } from '@harmony-js/core`](https://github.com/FireStack-Lab/harmony-sdk-examples/tree/master/tutorial#Import--Harmony--from-harmony-jscore)
   4. [Import phrases to Wallet](https://github.com/FireStack-Lab/harmony-sdk-examples/tree/master/tutorial#Import-phrases-to-Wallet)
   5. [Put it all together](https://github.com/FireStack-Lab/harmony-sdk-examples/tree/master/tutorial#Put-it-all-together)
4. [Compiling Job](https://github.com/FireStack-Lab/harmony-sdk-examples/tree/master/tutorial#Compiling-Job)
   1. [Compile with `solcjs` or `truffle.js` (Skippable)](https://github.com/FireStack-Lab/harmony-sdk-examples/tree/master/tutorial#Compile-with-solcjs-or-trufflejs-Skippable)
   2. [Import `fs` `path` and `solc` first](https://github.com/FireStack-Lab/harmony-sdk-examples/tree/master/tutorial#Import-fs-path-and-solc-first)
   3. [Locate FileName and get path(s)](https://github.com/FireStack-Lab/harmony-sdk-examples/tree/master/tutorial#Locate-FileName-and-get-paths)
   4. [Get `solc` to work](https://github.com/FireStack-Lab/harmony-sdk-examples/tree/master/tutorial#Get-solc-to-work)
   5. [Export the main compiling function](https://github.com/FireStack-Lab/harmony-sdk-examples/tree/master/tutorial#Export-the-main-compiling-function)
5. [Contract Deployment](https://github.com/FireStack-Lab/harmony-sdk-examples/tree/master/tutorial#Contract-Deployment)
   1. [Create contract instance and set params](https://github.com/FireStack-Lab/harmony-sdk-examples/tree/master/tutorial#Create-contract-instance-and-set-params)
   2. [Deploy and listening Transaction events](https://github.com/FireStack-Lab/harmony-sdk-examples/tree/master/tutorial#Deploy-and-listening-Transaction-events)
6. [Contract Call](https://github.com/FireStack-Lab/harmony-sdk-examples/tree/master/tutorial#Contract-Call)
   1. [Pick a method](https://github.com/FireStack-Lab/harmony-sdk-examples/tree/master/tutorial#Pick-a-method)
   2. [Make the call](https://github.com/FireStack-Lab/harmony-sdk-examples/tree/master/tutorial#Make-the-call)
7. [Address to address transaction](https://github.com/FireStack-Lab/harmony-sdk-examples/tree/master/tutorial#Address-to-address-transaction)
   1. [Construct a `Transaction`](https://github.com/FireStack-Lab/harmony-sdk-examples/tree/master/tutorial#Construct-a-Transaction)
   2. [Sign with `Account`](https://github.com/FireStack-Lab/harmony-sdk-examples/tree/master/tutorial#Sign-with-Account)
   3. [Send it to blockchain](https://github.com/FireStack-Lab/harmony-sdk-examples/tree/master/tutorial#Send-it-to-blockchain)
   4. [Confirm the result](https://github.com/FireStack-Lab/harmony-sdk-examples/tree/master/tutorial#Confirm-the-result)

# Test local wallet

1. open `nodejs`
2. run `node testWallet.js`
3. you can see `mnemonic` and `simple password` and 10 accounts imported
   

# Test with Harmony node

Currently unavailible


# Test with `ganache-cli`
** ganache-cli runs in js file **, 

In this case, we use ganache and ethereum's setting to simulate the result

We don't need harmony's testnode running.

1. open `nodejs`
2. run `node testGanache.js`
