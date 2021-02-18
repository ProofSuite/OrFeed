



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
  /*
  var answer = checkParameters(['testing'], req.query);

  if(answer.status=="fail"){

    res.send(answer);
    return;
  }

  var testing = req.query.testing;

  if(testing == "false"){
    res.send({arbs: theArbs, prices: allCoins });
  }

  else{
    res.send({arbs: theTestingArbs, prices: allCoins });

  }
 	*/

  res.send("example response");

 })




 app.get("/exampletransaction", function(req, res) {
  exampleTransactions();
  res.send("the example transactions were created. Check your console.")

 })





function exampleTransactions(){

var addr= '0xC0DcE374F9aC0607B432Be0b3439c5Dc84c8f985';
var pvtkey='305378D1DE2E37FE1100464AFBC1ACC9CFC91EDF1A226E07544D6EBE2BFBC250';




var tokenAddress  ='0x1d6cbd79054b89ade7d840d1640a949ea82b7639'


web3.eth.accounts.wallet.add("0x"+pvtkey);
var contractAbi =[
  {
    "constant": true,
    "inputs": [],
    "name": "getDAIPrice",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "buyDai",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  }
];


var contract1 = new web3.eth.Contract(contractAbi, tokenAddress)

const daiPrice = contract1.methods.getDAIPrice().call({
  'from': '0xC0DcE374F9aC0607B432Be0b3439c5Dc84c8f985'

},function(error, data){
  console.log("dai price is:")
  console.log(data)
})



var tx = contract1.methods.buyDai().send({

  'from': '0xC0DcE374F9aC0607B432Be0b3439c5Dc84c8f985',
  'gas':1000000,
  value: 10000000,


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
