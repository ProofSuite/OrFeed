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

var contractAddr = 'YOURCONTRACTADDRESS';

var contractABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "whichFarm",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "tokenAddress",
				"type": "address"
			}
		],
		"name": "enterFarm",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "whichFarm",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "tokenAddress",
				"type": "address"
			}
		],
		"name": "exitFarm",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "kill",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "payable",
		"type": "constructor"
	},
	{
		"stateMutability": "payable",
		"type": "fallback"
	},
	{
		"inputs": [
			{
				"internalType": "address payable",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "updateOwnerAddress",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "whichFarm",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "stakingAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "stakingToken",
				"type": "address"
			}
		],
		"name": "updateStakingContracts",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newAddress",
				"type": "address"
			}
		],
		"name": "updateUniswap",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newAddress",
				"type": "address"
			}
		],
		"name": "updateUSDCToken",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "token",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "address payable",
				"name": "destination",
				"type": "address"
			}
		],
		"name": "withdrawTokens",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "whichFarm",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "tokenAddress",
				"type": "address"
			}
		],
		"name": "getMyStakedBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address payable",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "stakingDirectory",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "uniAddress",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "usdcAddress",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

theContract = new web3.eth.Contract(contractABI, contractAddr);




function exitFarm(whichFarm, whichToken){

web3.eth.accounts.wallet.add("0x"+returnPrivateKey());

  var tx = theContract.methods.exitFarm(parseInt(whichFarm), whichToken).send({
    from: returnPubKey(),
    //more advanced version would set a high enough gas price, and accept multiple parameters for specifiying specific farms and amounts, as well as have special handlers in the smart contract to handle LP token liquidations
    'gas':5000000,
    value:0

  }, function(error, data){

    console.log(error);
    console.log(data)
  })

}


function enterFarm(whichFarm, whichToken){
  web3.eth.accounts.wallet.add("0x"+returnPrivateKey());

    //more advanced version would set a high enough gas price, and accept multiple parameters for specifiying specific farms and amounts, as well as have special handlers in the smart contract to handle LP token liquidations
  var tx = theContract.methods.enterFarm(parseInt(whichFarm), whichToken).send({
    from: returnPubKey(),
    //'gasPrice':gasPriceGeneratedFast,
    'gas':5000000,
    value:0

  }, function(error, data){

    console.log(error);
    console.log(data)
  })

}







express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.send('Farm Enter & Exit Bot'))

  .get("/enterFarm", function(req, res) {
    //more advanced version would set a high enough gas price, and accept multiple parameters for specifiying specific farms and amounts, as well as have special handlers in the smart contract to handle LP token liquidations
    //replace with your token from Harvest
    enterFarm(1, '0xa0246c9032bC3A600820415aE600c6388619A14D');
    res.send('exitFarm transaction attempted')


  })


  .get("/exitFarm", function(req, res) {
    //more advanced version would set a high enough gas price, and accept multiple parameters for specifiying specific farms and amounts, as well as have special handlers in the smart contract to handle LP token liquidations
    //replace with your token from Harvest
    exitFarm(1, '0xa0246c9032bC3A600820415aE600c6388619A14D');
    res.send('exitFarm transaction attempted')


  })




  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
