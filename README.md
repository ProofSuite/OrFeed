# OrFeed Smart Contract

## Decentralized Price Feed for Crypto, Forex, Stocks, ETFs and more.

A highly reliable oracle for Ethereum-based DeFi apps that need financial data from the outside world.

![OrFeed Logo](https://www.orfeed.org/images/orfeed.png)


Website: [orfeed.org](https://www.orfeed.org)

[The Reality Stone on the Blockchain](https://medium.com/proof-of-fintech/the-reality-stone-on-the-blockchain-accessible-to-all-1654a3ec71a7) blog post

[How OrFeed Was Conceived](https://medium.com/proof-of-fintech/introducing-orfeed-aa323342d34c) blog post

Demo: [https://etherscan.io/dapp/0x73f5022bec0e01c0859634b0c7186301c5464b46](https://etherscan.io/dapp/0x73f5022bec0e01c0859634b0c7186301c5464b46)

[Youtube video tutorial](https://youtu.be/LK1BiSveEI4)


## Getting Started

At the top of your smart contract or in a referenced file in your dApp project, include this interface.

```javascript
interface OrFeedInterface {
  function getExchangeRate ( string fromSymbol, string toSymbol, string venue, uint256 amount ) external view returns ( uint256 );
  function getTokenDecimalCount ( address tokenAddress ) external view returns ( uint256 );
  function getTokenAddress ( string symbol ) external view returns ( address );
  function getSynthBytes32 ( string symbol ) external view returns ( bytes32 );
  function getForexAddress ( string symbol ) external view returns ( address );
}
```


To Initialize OrFeed, simply include this code:

```javascript
OrFeedInterface orfeed= OrFeedinterface(0x73f5022bec0e01c0859634b0c7186301c5464b46);

```

One of the best things about OrFeed is that OrFeed automatically detects which kind of asset you are looking for (though the data can come from different providers), as the parameter of "venue" when making the getExchangeRate call. For example, you can get the price for ETH/USD the same way you get the price for JPY/ETH. The 3rd parameter is the venue. Use blank ('') for default oracle. In the future, you can reference several venues/providers to get their data and throw out any that deviate too far from the average.

```javascript
uint jpyusdPrice = orfeed.getExchangeRate("JPY", "USD", "DEFAULT", 100000);
// returns 920 (or $920.00)
```

Note: Replace "DEFAULT" with the oracle provider you would like data from. For example, if you want to know Uniswap's price on the buy side, use "BUY-UNISWAP-EXCHANGE". If you want Kyber's sell side data for the same, you can use "SELL-KYBER-EXCHANGE". Because ERC-20s have many, many integers, when getting prices from token to token, be sure to use very large amounts.... 1000000000 DAI is less than one penny, for example, due to divisibility at 18. 

More examples:

```javascript
uint price = orfeed.getExchangeRate("ETH", "USDC", "BUY-KYBER-EXCHANGE", 100000000000000);
```

```javascript
uint price = orfeed.getExchangeRate("BTC", "DAI", "SELL-UNISWAP-EXCHANGE", 100);
```

```javascript
uint price = orfeed.getExchangeRate("MKR", "EUR", "", 100000000000000);
```




### Read the full docs [orfeed.org/docs](https://www.orfeed.org/docs)

Free data is provided by Kyber, Uniswap and Synthetix. 

Premium data is provided as follows:

![How it all fits together](https://www.orfeed.org/images/diagram.png)

### Demo on Testnets
the OrFeed demo already deployed to testnets  
**Kovan**: [0x31a29958301c407d4b4bf0d53dac1f2d154d9d8d](https://kovan.etherscan.io/address/0x31a29958301c407d4b4bf0d53dac1f2d154d9d8d)  
**Rinkeby**: [0x97875355ef55ae35613029df8b1c8cf8f89c9066](https://rinkeby.etherscan.io/address/0x97875355ef55ae35613029df8b1c8cf8f89c9066) 

