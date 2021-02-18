const TestContract = artifacts.require('./TestContract.sol')
const BigNumber = require('bignumber.js')

const Web3 = require('web3')
let ownerAddress
function pow (input) {
  return new BigNumber(input).times(new BigNumber(10).pow(18))
}
module.exports = function (deployer, network, accounts) {
  ownerAddress = accounts[0]
  if (network == 'development') {
    web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
    ownerAddress = accounts[0]
  } else if (network == 'ropsten') {
    web3 = new Web3(
      new Web3.providers.HttpProvider(
        'https://ropsten.infura.io/v3/6b455d8a8338421b8e0e2db7d3264419'
      )
    )
    ownerAddress = accounts[0]
  } else if (network == 'mainnet') {
    web3 = new Web3(
      new Web3.providers.HttpProvider(
        'https://mainnet.infura.io/g5xfoQ0jFSE9S5LwM1Ei'
      )
    )
    ownerAddress = accounts[0]
  }

  return deployer.deploy(TestContract).then(() => {
    // console.log(`
    //     ERC721 : ${ERC721.address} \n
    //     EthOptionFactory: ${EthOptionsFactory.address}
    //     `)
  })
}
