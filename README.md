# harmony-sdk-examples

# Install

```bash
yarn install
```


# Test local wallet

1. open `nodejs`
2. run `node testWallet.js`
3. you can see `mnemonic` and `simple password` and 10 accounts imported
   

# Test with Harmony node

First you have to run harmony's test node.

1. git clone
   
    ``` bash
    git clone git@github.com:harmony-one/harmony.git
    ```

2. follow the `Build all executables` instruction, [here](https://github.com/harmony-one/harmony/tree/master)
3. open your editor, inside `core/resharding.go` , edit `GenesisShardSize = 50` to `GenesisShardSize = 5`
4. use this script to run
   
   ```bash
   ./test/deploy.sh ./test/configs/ten-oneshard.txt
   ```

Wait for the test-node running for 30 seconds,

Then **open another console** , go back to our `nodejs` folder, 

Run:

``` bash
node testNode.js
```


# Test with `ganache-cli`
** ganache-cli runs in js file **, 

In this case, we use ganache and ethereum's setting to simulate the result

We don't need harmony's testnode running.

1. open `nodejs`
2. run `node testGanache.js`
