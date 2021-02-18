const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000


Web3 = require("web3");


web3 = new Web3('https://mainnet.infura.io/v3/YOUR+KEY');

const fileGetContents = require('file-get-contents');

function returnPrivateKey(){
  var key ='YOURPRIVATEKEY';
  return key;
}

function returnPubKey(){

  pub = 'YOURPUBLICADDRESS';
  return pub;
}

var contractAddr = '0x90F765F63E7DC5aE97d6c576BF693FB6AF41C129';

var contractABI = [{"inputs":[{"internalType":"contract IController","name":"_controller","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"contract ISetToken","name":"_setToken","type":"address"},{"indexed":true,"internalType":"address","name":"_sendToken","type":"address"},{"indexed":true,"internalType":"address","name":"_receiveToken","type":"address"},{"indexed":false,"internalType":"contract IExchangeAdapter","name":"_exchangeAdapter","type":"address"},{"indexed":false,"internalType":"uint256","name":"_totalSendAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_totalReceiveAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_protocolFee","type":"uint256"}],"name":"ComponentExchanged","type":"event"},{"inputs":[],"name":"controller","outputs":[{"internalType":"contract IController","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract ISetToken","name":"_setToken","type":"address"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"removeModule","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract ISetToken","name":"_setToken","type":"address"},{"internalType":"string","name":"_exchangeName","type":"string"},{"internalType":"address","name":"_sendToken","type":"address"},{"internalType":"uint256","name":"_sendQuantity","type":"uint256"},{"internalType":"address","name":"_receiveToken","type":"address"},{"internalType":"uint256","name":"_minReceiveQuantity","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"trade","outputs":[],"stateMutability":"nonpayable","type":"function"}];

theContract = new web3.eth.Contract(contractABI, contractAddr);




function rebalance(params, response){

web3.eth.accounts.wallet.add("0x"+returnPrivateKey());

  var tx = theContract.methods.trade(params._setToken, params._exchangeName, params._sendToken, params._sendQuantity, params._receiveToken, params._minReceiveQuantity, params._data)
    .send({
    from: returnPubKey(),
    //more advanced version would set a high enough gas price, and accept multiple parameters for specifiying specific farms and amounts, as well as have special handlers in the smart contract to handle LP token liquidations
    //'gas':5000000,
    value:0

  }, function(error, data){

    console.log(error);
    console.log(data)

    if(!error){
      response.send(data)
    }
    else{
      response.send(error);
    }
  })

}


express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.send('TokenSet Simple Rablance Bot'))
  .get("/rebalance", function(req, res) {

    rebalance(req.query);


  })

  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
