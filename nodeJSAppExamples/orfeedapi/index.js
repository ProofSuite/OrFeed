



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





var server = http.createServer(app).listen(PORT, () => console.log(`Listening on ${ PORT }`))

app.use(express.static(path.join(__dirname, 'public')))


var cors = require('cors');
app.use(cors({credentials: true, origin: '*'}));
 // .set('views', path.join(__dirname, 'views'))
  //.set('view engine', 'ejs')
  //.get('/', (req, res) => res.render('pages/index'))
 app.get("/", function(req, res) {


  res.send("Welcome to the OrFeed API. Learn more at https://www.orfeed.org/docs");

 })




 app.get("/getExchangeRate", function(req, res) {
  var answer = checkParameters(['fromSymbol', 'toSymbol', 'venue', 'amount'], req.query)
  if(answer.status=="fail"){

    res.send(answer);
    return;
  }

  getPrices(res, req.query.fromSymbol, req.query.toSymbol, req.query.venue, parseInt(req.query.amount).toString());


 })

 app.get("/prices", function(req, res) {
  

  res.send([receivedPrices, receivedSymbols]);
 })


function getPrices(theRes, fromSymbol, toSymbol, venue, amount){

  contractAddr = '0x8316b082621cfedab95bf4a44a1d4b64a6ffc336';
  abi = [{"constant":false,"inputs":[{"name":"symb","type":"string"},{"name":"tokenAddress","type":"address"},{"name":"byteCode","type":"bytes32"}],"name":"addFreeCurrency","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"fromSymbol","type":"string"},{"name":"toSymbol","type":"string"},{"name":"venue","type":"string"},{"name":"amount","type":"uint256"},{"name":"referenceId","type":"string"}],"name":"requestAsyncExchangeRateResult","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"eventName","type":"string"},{"name":"source","type":"string"},{"name":"referenceId","type":"string"}],"name":"getAsyncEventResult","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newDiv","type":"uint256"},{"name":"newMul","type":"uint256"}],"name":"updateMulDivConverter2","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"synth","type":"bytes32"},{"name":"token","type":"address"},{"name":"inputAmount","type":"uint256"}],"name":"getSynthToTokenOutputAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"symb","type":"string"},{"name":"tokenAddress","type":"address"}],"name":"addFreeToken","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_a","type":"string"},{"name":"_b","type":"string"}],"name":"compare","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOracle","type":"address"}],"name":"updateForexOracleAddress","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_a","type":"string"},{"name":"_b","type":"string"}],"name":"equal","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"eventName","type":"string"},{"name":"source","type":"string"}],"name":"getEventResult","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOracle","type":"address"}],"name":"updateSynthAddress","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newDiv","type":"uint256"},{"name":"newMul","type":"uint256"}],"name":"updateMulDivConverter1","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newDiv","type":"uint256"},{"name":"newMul","type":"uint256"}],"name":"updateMulDivConverter3","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"fromSymbol","type":"string"},{"name":"toSymbol","type":"string"},{"name":"venue","type":"string"},{"name":"amount","type":"uint256"}],"name":"getExchangeRate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"symb","type":"string"}],"name":"removeFreeToken","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOracle","type":"address"}],"name":"updateEthTokenAddress","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"fundsReturnToAddress","type":"address"},{"name":"liquidityProviderContractAddress","type":"address"},{"name":"tokens","type":"string[]"},{"name":"amount","type":"uint256"},{"name":"exchanges","type":"string[]"}],"name":"arb","outputs":[{"name":"","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"newOracle","type":"address"}],"name":"updatePremiumSubOracleAddress","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_haystack","type":"string"},{"name":"_needle","type":"string"}],"name":"indexOf","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"symb","type":"string"}],"name":"removeFreeCurrency","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOracle","type":"address"}],"name":"updateAsyncOracleAddress","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"venueToCheck","type":"string"}],"name":"isFreeVenueCheck","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"symToCheck","type":"string"}],"name":"isFree","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newAddress","type":"address"}],"name":"updateArbContractAddress","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"changeOwner","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOracle","type":"address"}],"name":"updateAsyncEventsAddress","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"tokenAddress","type":"address"}],"name":"getTokenDecimalCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"a","type":"string"},{"name":"b","type":"string"}],"name":"compareStrings","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"eventName","type":"string"},{"name":"source","type":"string"}],"name":"requestAsyncEvent","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"symbol","type":"string"}],"name":"getTokenAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"synth","type":"bytes32"},{"name":"inputAmount","type":"uint256"}],"name":"getTokenToSynthOutputAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"source","type":"string"}],"name":"stringToBytes32","outputs":[{"name":"result","type":"bytes32"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"fromSymbol","type":"string"},{"name":"toSymbol","type":"string"},{"name":"venue","type":"string"},{"name":"amount","type":"uint256"}],"name":"requestAsyncExchangeRate","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOracle","type":"address"}],"name":"updateTokenOracleAddress2","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOracle","type":"address"}],"name":"updateSyncEventsAddress","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"symbol","type":"string"}],"name":"getSynthBytes32","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"fromSymb","type":"string"},{"name":"toSymb","type":"string"},{"name":"amount","type":"uint256"}],"name":"getFreeExchangeRate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOracle","type":"address"}],"name":"updateTokenOracleAddress","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newDiv","type":"uint256"},{"name":"newMul","type":"uint256"}],"name":"updateMulDivConverter4","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"symbol","type":"string"}],"name":"getForexAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"param1","type":"string"},{"name":"param2","type":"string"},{"name":"param3","type":"string"},{"name":"param4","type":"string"}],"name":"callExtraFunction","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":true,"stateMutability":"payable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"}]
   var orContract = new web3.eth.Contract(abi, contractAddr)

orContract.methods.getExchangeRate(fromSymbol, toSymbol, venue, amount.toString()).call({
  'from': '0xC0DcE374F9aC0607B432Be0b3439c5Dc84c8f985'

},function(error, data){
  console.log("Response is:")
  console.log(data)
  try{
  theRes.send({status:"success", "data":parseInt(data)})
}

catch(err){
  theRes.send({status:"fail", "data":err})
}
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






