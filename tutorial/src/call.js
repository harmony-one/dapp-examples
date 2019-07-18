import fs from 'fs'
import { harmony } from './harmony'
import { BN } from '@harmony-js/crypto'

export async function callContract(abi, contractAddress) {
  const deployedContract = harmony.contracts.createContract(
    abi,
    contractAddress
  )

  const callResult = await deployedContract.methods
    .inputFunction(666666, 'neeboo')
    .call({
      gasLimit: new BN('210000'),
      gasPrice: new BN('10000000000')
      // value: new harmony.utils.Unit('0.2').asEther().toWei()
    })
  return callResult
}

// command line only
if (process.argv0 !== undefined && process.argv.slice(2)[0] !== undefined) {
  const abiFile = JSON.parse(fs.readFileSync(process.argv.slice(2)[0], 'utf8'))
  const { abi } = abiFile
  const contractAddress = harmony.utils.isValidAddress(process.argv.slice(2)[1])
    ? process.argv.slice(2)[1]
    : JSON.parse(fs.readFileSync(process.argv.slice(2)[1], 'utf8'))
        .contractAddress
  callContract(abi, contractAddress).then(result => {
    console.log(result)

    /**
     *  do with result here, we simply console.log
     */

    process.exit()
  })
}
