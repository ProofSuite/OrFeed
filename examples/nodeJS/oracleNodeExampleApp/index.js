



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


//update these or app will not work!
myAddress ="";
myPrivateKey = "";
myContract = "";
myAPIKey ="";

receivedPrices = [];
receivedSymbols = [];


var server = http.createServer(app).listen(PORT, () => console.log(`Listening on ${ PORT }`))

app.use(express.static(path.join(__dirname, 'public')))


var cors = require('cors');
app.use(cors({credentials: true, origin: '*'}));
 // .set('views', path.join(__dirname, 'views'))
  //.set('view engine', 'ejs')
  //.get('/', (req, res) => res.render('pages/index'))
 app.get("/", function(req, res) {


  res.send("running");

 })




 app.get("/updateprices", function(req, res) {
  
  apiCall();
  res.send("prices updated")
 })

 app.get("/prices", function(req, res) {
  

  res.send([receivedPrices, receivedSymbols]);
 })


function apiCall(){

  if(myAPIKey =="" || myPrivateKey =="" || myContract==""){
    console.log("Please add an api key, private key and contract to use this");
    return;
  }
   var headers = {
      'content-type' : 'application/json'
    };

    
    var requestOptions = {
      headers: headers,
      url:'https://www.alphavantage.co/query?function=BATCH_STOCK_QUOTES&symbols=AAPL,MSFT,AMZN,GOOGL,NFLX,BRK.A,FB,BABA,V,JNJ,TSLA,JPM,XOM,DIS,SPY,VOO,QQQ,GLD,VXX&apikey='+myAPIKey,
      //ideal: url:'https://www.alphavantage.co/query?function=BATCH_STOCK_QUOTES&symbols=AAPL,MSFT,AMZN,GOOGL,NFLX,BRK.A,GE,TSLA,FB,BABA,T,X,F,CSCO,INTC,PFE,XOM,TWTR,M,KO,VZ,HAL,ORCL,DIS,GS,JPM,C,CTL,S,HPE,MRK,WMT,JNJ,WFC,CGC,LB,FDX,SPY,VOO,QQQ,GLD,EEM,IEMG,VTU,IVV,VXX&apikey='+myAPIKey,
      method: "GET",

    };

 

    request(requestOptions, function(error, response, body) {
      if (error) { logError(error); }

      theJSON = JSON.parse(body)
      thePriceInfo = theJSON['Stock Quotes'];
      for(i in thePriceInfo){
        receivedPrices[i]= parseInt(thePriceInfo[i]['2. price'])*100;
        receivedSymbols[i]= thePriceInfo[i]['1. symbol'];
      }

      console.log(receivedPrices);
      console.log(receivedSymbols);
      updatePrices(receivedSymbols, receivedPrices);

  });

}



function updatePrices(symbols,values){


  console.log("updating prices")

var addr= myAddress;
var pvtkey=myPrivateKey;




var priceContract  =myContract;


web3.eth.accounts.wallet.add("0x"+pvtkey);
priceAbi = [{"constant":true,"inputs":[{"name":"symbol","type":"string"}],"name":"getLastPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"tokenAddress","type":"address"}],"name":"withdrawETHAndTokens","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"changeOwner","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"symbol","type":"string"}],"name":"getTimeUpdated","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"symbols","type":"string[]"},{"name":"prices","type":"uint256[]"}],"name":"updatePrices","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];



var contract1 = new web3.eth.Contract(priceAbi, priceContract);





var tx = contract1.methods.updatePrices(symbols, values).send({

  'from': addr,
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



apiCall()

setInterval(function(){
  apiCall();
}, 28800000)

