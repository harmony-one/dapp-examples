# harmony-sdk-examples

# Install

```bash
yarn install
```

# Test with Harmony node

## Run harmony's local testnet first

1. Get harmony's node using this branch: [demo branch](https://github.com/mikedoan/harmony/tree/demo)
2. run `./test/debug.sh`


## Run dApp(WebApp) examples

1. go to project root, build all and start using
   
```bash
yarn start
```

**NOTE: Building require a few minutes, please hold on**

When building is over you should able to can see:

```bash
Successfully compiled 13 files with Babel.
❌  Server-side HMR Not Supported.
express http is listening on 3000
```


2. open `http://localhost:3000` to access the simple admin portal

   - on the left menu, select contracts
   - you can see `lottery` in a row, click `detail`, then `deploy` button
   - enter your private key, please use `27978f895b11d9c737e1ab1623fde722c04b4f9ccb4ab776bf15932cc72d7c66`
   - choose network, if you had the harmony local testnet running, choose `localHarmony`, if you want to choose `EthGanache`, please run local ganache-cli first(see below)
   - enter amount or not simply don't enter anything, then click the big button
   - you can see the contract is send then confirmed then deployed
   - In `Histories` section, click the `set contract` link on the right, then confirm with clicking the `ok` button.
   - Now the `lottery contract` can be accessed by `Lottery App`

3. (Optional) Run `ganache-cli`
   
    open another console, go to project root

```bash
yarn run:ganache
```

4. open `http://localhost:3000/lottery` to access the `Lottery App`
   
- You should be able to see a big `login` button, click it
- enter `27978f895b11d9c737e1ab1623fde722c04b4f9ccb4ab776bf15932cc72d7c66`, press `ok`
- Then you can deposit some token, click `deposit` and enter some value, `0.11` is the minimum.
- Then the contract will be called, and you money is deposited to it.
- Now click the `home` icon on the top right, you should `logout` to the front page.
- Try login with another key, you can choose either one of these:
  
```bash
        "371cb68abe6a6101ac88603fc847e0c013a834253acee5315884d2c4e387ebca",
        "3f8af52063c6648be37d4b33559f784feb16d8e5ffaccf082b3657ea35b05977",
        "df77927961152e6a080ac299e7af2135fc0fb02eb044d0d7bbb1e8c5ad523809", 
        "fcff43741ad2dd0b232efb159dc47736bbb16f11a79aaeec39b388d06f91116d",  
        "916d3d78b7f413452434e89f9c1f1d136995ef02d7dc8038e84cc9cef4a02b96", 
        "f5967bd87fd2b9dbf51855a2a75ef0a811c84953b3b300ffe90c430a5c856303",  
        "f02f7b3bb5aa03aa97f9e030020dd9ca306b209742fafe018104a3207a70a3c9", 
        "0436864cc15772448f88dd40554592ff6c91a6c1a389d965ad26ee143db1234d",  
        "dea956e530073ab23d9cae704f5d068482b1977c3173c9efd697c48a7fd3ce83", 
        "af539d4ace07a9f601a8d3a6ca6f914d5a9fabe09cfe7d62ebc2348fc95f03a4",  
        "7d24797eeba0cdac9bf943f0d82c4b18eb206108d6e1b7f610471594c0c94306", 
        "4fa2fecce1becfaf7e5fba5394caacb318333b04071462b5ca850ee5a406dcfe",  
        "3c8642f7188e05acc4467d9e2aa7fd539e82aa90a5497257cf0ecbb98ed3b88f", 
        "bf29f6a33b2c24a8b5182ef44cc35ce87534ef827c8dfbc1e6bb536aa52f8563"
```
    
   - Now you should be able to deposit value to the contract, use the same flow as previous
   - Logout and use `27978f895b11d9c737e1ab1623fde722c04b4f9ccb4ab776bf15932cc72d7c66` to login again
   - You are the deployer of the contract, you can pick winner. click `Pick Winner` and press confirm on the pop-up.
   - Now the contract is picking the winner, when the waiting is done, the winner will receive money

5. You can access `http://localhost:3000/wallet` as well,
   **Note: The webwallet is not finished yet, please wait**


## Use command-line to test

Go to `nodejs` folder

There are 4 test scripts for testing

1. testWallet.js
2. testSign.js
3. testNode.js
4. testContract.js

open a console, use `node test{xxx}.js` to run the tests.

for example:

```bash
node testWallet.js
```

# Test with other tools
## Test with `ganache-cli`
** ganache-cli runs in js file **, 

In this case, we use ganache and ethereum's setting to simulate the result

We don't need harmony's testnode running.

1. open `nodejs`
2. run `node testGanache.js`


# Tutorial

1. [What is it](https://github.com/FireStack-Lab/harmony-sdk-examples/tree/master/tutorial#What-is-it)
2. [Very Quick Start](https://github.com/FireStack-Lab/harmony-sdk-examples/tree/master/tutorial#Very-Quick-Start)
3. [Get `Harmony` ready](https://github.com/FireStack-Lab/harmony-sdk-examples/tree/master/tutorial#Get-Harmony-ready)
4. [Compiling Job](https://github.com/FireStack-Lab/harmony-sdk-examples/tree/master/tutorial#Compiling-Job)
5. [Contract Deployment](https://github.com/FireStack-Lab/harmony-sdk-examples/tree/master/tutorial#Contract-Deployment)
6. [Contract Call](https://github.com/FireStack-Lab/harmony-sdk-examples/tree/master/tutorial#Contract-Call)
7. [Address to address transaction](https://github.com/FireStack-Lab/harmony-sdk-examples/tree/master/tutorial#Address-to-address-transaction)