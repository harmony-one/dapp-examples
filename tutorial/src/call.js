import fs from 'fs'
import { harmony } from './harmony'
import { BN } from '@harmony-js/crypto'

export async function callContract(abi, contractAddress, method, ...args) {
  const deployedContract = harmony.contracts.createContract(
    abi,
    contractAddress
  )

  console.log({
    data: deployedContract.methods[method].apply(null, args).encodeABI()
  })
  console.log({ from: harmony.wallet.signer.checksumAddress })

  const methodClass = deployedContract.methods[method]

  const callResult = await methodClass.apply(null, args).call({
    gasLimit: new BN('210000'),
    gasPrice: new BN('10000000000'),
    from: '0x0000000000000000000000000000000000000000'
    // hmy_call {gas,gasPrice,*from,*to,*data}
  })
  return callResult
}
export async function alterContract(abi, contractAddress, method, ...args) {
  const deployedContract = harmony.contracts.createContract(
    abi,
    contractAddress
  )
  const methodClass = deployedContract.methods[method]

  methodClass.wallet.signer = undefined

  console.log(methodClass)
  const callResult = await methodClass.apply(null, args).send({
    gasLimit: new BN('210000'),
    gasPrice: new BN('10000000000')
    // from: harmony.wallet.signer.checksumAddress
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

  // const myContract = harmony.contracts.createContract(abi, contractAddress)

  // myContract.events
  //   .DemoEvent({ fromBlock: 'latest' })
  //   .on('data', data => {
  //     console.log(data)
  //   })
  //   .on('changed', changed => {
  //     console.log(changed)
  //   })
  //   .on('error', error => {
  //     console.log(error)
  //   })

  // callContract(abi, contractAddress, 'print').then(result => {
  //   console.log('print', result)
  // })
  // callContract(abi, contractAddress, 'add', 123, 321).then(result => {
  //   console.log('add', result)
  // })
  callContract(abi, contractAddress, 'manager').then(result => {
    console.log('manager', result)
  })

  // callContract(abi, contractAddress, 'fireEvent', 333).then(() => {
  //   console.log('')
  //   console.log('----------')
  //   console.log('')
  //   console.log('called')
  //   console.log('')
  //   console.log('----------')
  //   alterContract(abi, contractAddress, 'fireEvent', 444).then(() => {
  //     console.log('')
  //     console.log('----------')
  //     console.log('')
  //     console.log('triggered')
  //     console.log('')
  //     console.log('----------')
  //     callContract(abi, contractAddress, 'fireEvent', 555).then(() => {
  //       console.log('')
  //       console.log('----------')
  //       console.log('')
  //       console.log('done')
  //       console.log('')
  //       console.log('----------')
  //     })
  //   })
  // })
}
