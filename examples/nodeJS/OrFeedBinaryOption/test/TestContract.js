const BigNumber = require('bignumber.js')
// const ERC721 = artifacts.require('./ERC721.sol')
// const PriceOracle = artifacts.require('./PriceOracle.sol');
const TestContract = artifacts.require('./TestContract.sol')
// const TokenA = artifacts.require('./TokenA')
// const TokenB = artifacts.require('./TokenB.sol')
const { parseLog } = require('ethereum-event-logs')
const { abi } = require('../build/contracts/TestContract.json')

function pow (input) {
  return new BigNumber(input).times(new BigNumber(10).pow(18))
}

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
contract('TestContract', accounts => {
  // accounts
  const player1 = accounts[0]
  const player2 = accounts[1]
  const player3 = accounts[2]
  const player4 = accounts[3]

  before(async () => {
    testContract = await TestContract.new()
    console.log(`Test address: TestContract: ${testContract.address}`)
    console.log(`Player1 : ${player1}`)
    console.log(`Player2 : ${player2}`)
    console.log(`Player3 : ${player3}`)
    console.log(`Player4 : ${player4}`)
  })

  beforeEach(async () => {})

  describe('Test Cases for creating 3 new Binary Options', async () => {
    it('createNewOption: With 1 Eth and long position by player1', async () => {
      testContract.createOption(1, { from: player1, value: pow(1) })
    })
    it('createNewOption: With 1 Eth and long position by player2', async () => {
      testContract.createOption(1, { from: player2, value: pow(1) })
    })
    it('createNewOption: With 1 Eth and short position by player3', async () => {
      testContract.createOption(0, { from: player3, value: pow(1) })
    })
    it('createNewOption: With 1 Eth and long position by player4', async () => {
      testContract.createOption(1, { from: player4, value: pow(1) })
    })

    describe('Waiting for one minute, changing the price and then calling the settle function', async () => {
      it('Set the strike price to 9: so player 3 should get back 3 eth', async () => {
        console.log('sleeping')
        await sleep(60000)
        console.log('sleep over')
        testContract.setStrikePrice(9)
        let txReturn = await testContract.settleOptions()
        // console.log(txReturn)
        const eventAbi = abi.find(({ name }) => name === 'moneySent')
        const events = parseLog(txReturn.receipt.rawLogs, [eventAbi])
        events.forEach(event => {
          console.log(event.name)
          console.log(event.args)
        })
      })
    })
  })
})
