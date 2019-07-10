import fs from 'fs'
import path from 'path'
import solc from 'solc'

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
