



console.log("Starting")
const express = require('express')
const path = require('path')
var request = require('request');


const PORT = process.env.PORT || 5000
var bodyParser = require("body-parser");
var cors = require('cors');


var player = require('play-sound')(opts = {})

var app = express();



const http = require('http')


Web3 = require("web3");


web3 = new Web3('https://mainnet.infura.io/v3/ed07e65b44354a48aa1f5547369fb513');

var saiPriceBuyUniswap = 0;
var saiPriceSellKyber = 0;
var currentlyTrading= false;


var server = http.createServer(app).listen(PORT, () => console.log(`Listening on ${ PORT }`))

app.use(express.static(path.join(__dirname, 'public')))


var cors = require('cors');
app.use(cors({credentials: true, origin: '*'}));
 // .set('views', path.join(__dirname, 'views'))
  //.set('view engine', 'ejs')
  //.get('/', (req, res) => res.render('pages/index'))
 app.get("/", function(req, res) {


  res.send({ uniswapBuy: saiPriceBuyUniswap, kyberSell: saiPriceSellKyber });

 })




 app.get("/exampletransaction", function(req, res) {
  exampleTransactions();
  res.send("the example transactions were created. Check your console.")

 })


function getPrices(){

  contractAddr = '0x1603557c3f7197df2ecded659ad04fa72b1e1114';
  arbAbi = [{"constant":true,"inputs":[],"name":"getUniswapBuyPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getKyberSellPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"withdrawETHAndTokens","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"fromAddress","type":"address"},{"name":"uniSwapContract","type":"address"},{"name":"theAmount","type":"uint256"}],"name":"kyberToUniSwapArb","outputs":[{"name":"","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"proxy","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"}];
  var priceContract = new web3.eth.Contract(arbAbi, contractAddr)

priceContract.methods.getUniswapBuyPrice().call({
  'from': '0xC0DcE374F9aC0607B432Be0b3439c5Dc84c8f985'

},function(error, data){
  console.log("Uniswap SAI Buy price is:")
  console.log(data)
  saiPriceBuyUniswap = parseInt(data)
})


 priceContract.methods.getKyberSellPrice().call({
  'from': '0xC0DcE374F9aC0607B432Be0b3439c5Dc84c8f985'

},function(error, data){
  console.log("Kyber SAI Sell price is:")
  console.log(data)
  saiPriceSellKyber =  parseInt(data)
})



}


function arbTrade(){

  if(currentlyTrading == true){
    return false;
  }

  currentlyTrading = true;
  setTimeout(function(){
    currentlyTrading = false;
  }, 45000);


  console.log("starting arb trade. Cant execute another trade for 45 seconds")

var addr= '0xC0DcE374F9aC0607B432Be0b3439c5Dc84c8f985';
var pvtkey='305378D1DE2E37FE1100464AFBC1ACC9CFC91EDF1A226E07544D6EBE2BFBC250';




var tradeContract  ='0x1603557c3f7197df2ecded659ad04fa72b1e1114'


web3.eth.accounts.wallet.add("0x"+pvtkey);
arbAbi = [{"constant":true,"inputs":[],"name":"getUniswapBuyPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getKyberSellPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"withdrawETHAndTokens","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"fromAddress","type":"address"},{"name":"uniSwapContract","type":"address"},{"name":"theAmount","type":"uint256"}],"name":"kyberToUniSwapArb","outputs":[{"name":"","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"proxy","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"}];



var contract1 = new web3.eth.Contract(arbAbi, tradeContract);





var tx = contract1.methods.kyberToUniSwapArb('0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359', '0x09cabec1ead1c0ba254b09efb3ee13841712be14', 50000000).send({

  'from': '0xC0DcE374F9aC0607B432Be0b3439c5Dc84c8f985',
  'gas':1000000,
  value:0,


}, function(error, data){
  console.log(error);
  console.log(data)
})


}


function checkParameters(requiredParams, sentParams){

  hasAll = true;

  for (i in requiredParams){
    var hasThis = false;
    for(j in sentParams){
      if(requiredParams[i] == j){
        hasThis = true;
      }
    }

    if(hasThis == false){
      return {"status":"fail", "msg":"please send "+ requiredParams[i]};

    }

  }


  return {"status":"success", "msg":"Has all the params"};

}


setInterval(function(){
  console.log('checking to see if we should execute for arb')
  if(saiPriceBuyUniswap < saiPriceSellKyber){
    arbTrade();
  }
  else{
    console.log("no arb");
  }
}, 5000);



setInterval(function(){
  getPrices();
}, 3000)
