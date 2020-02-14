/*
    Triangle Arbitrage Calculator
    author: Jorge Londono

 */
import React, { useState } from 'react';
import './App.css';
import Web3 from 'web3';

function App() {

  const [ bestArbitrageProfit, setBestArbitrageProfit ] = useState();
  const [ bestArbitrageTrade, setBestArbitrageTrade ] = useState([]);

  // Data from these exchanges available
  const purchaseExchg = [ "BANCOR", "BUY-KYBER-EXCHANGE", "BUY-UNISWAP-EXCHANGE" ];
  const sellExchg = [ "BANCOR", "SELL-KYBER-EXCHANGE", "SELL-UNISWAP-EXCHANGE" ];

  // Address of the OrFeed contract on mainnet
  const contractAddr = '0x8316B082621CFedAB95bf4a44a1d4B64a6ffc336';
  let orfeed = null;


  function handleSubmit(event) {
    event.preventDefault();
    const symbolList = [ event.target.elements.s1.value, event.target.elements.s2.value, event.target.elements.s3.value ];
    const startValue = event.target.elements.startValue.value;
    console.log(`Submit: ${symbolList}`);
    arbitrage(symbolList, startValue);
  }


  // Instanciate the contract and start the triangular arbitrage computation
  function arbitrage(symbolList, startValue) {
    const web3 = new Web3(Web3.givenProvider);

    fetch('OrFeed.abi')
    .then(response => response.json())
    .then( async contractABI => {
      orfeed = new web3.eth.Contract(contractABI, contractAddr);
      triangleArbitration(symbolList, startValue, sellExchg)
      .then(trades => {
        let list = [];
        trades.forEach( aTrade => {
          list.push(`${aTrade.exchange} : ${aTrade.fromSymbol}:${aTrade.startValue}->${aTrade.toSymbol}:${aTrade.endValue}`)
        });
        setBestArbitrageTrade(list);
        setBestArbitrageProfit(trades[trades.length-1].endValue-trades[0].startValue);
      })
      .catch(console.error);
    })
    .catch(console.error);
  }


  // maximum and its position in an array
  function maxAndPos(array) {
    let max = -Infinity;
    let len = array.length;
    let pos = -1;
    while(len--) {
      if (array[len]>max) { max=array[len]; pos=len; }
    }
    return { max: max, pos: pos };
  }


  // Compute the cost of swap in different exchanges
  async function arbitrationProfit(symbolPair, startValue, exchanges) {
    // console.log(orfeed);
    console.log(`pair: ${symbolPair}`);
    let promises = exchanges.map( pExchg => orfeed.methods.getExchangeRate(symbolPair[0],symbolPair[1],pExchg,startValue).call() );
    return new Promise( function(resolve, reject) {
      //Promise.all(promises).then( values => {
      Promise.all(promises.map(p => p.catch(e => -Infinity)))
      .then( values => {
        console.log(`Values: ${values}`);
        let mp = maxAndPos(values.map(x => (x instanceof Error) ? -Infinity:parseInt(x) ));
        //console.log(mp);
        resolve({
          fromSymbol: symbolPair[0],
          toSymbol: symbolPair[1],
          startValue: startValue,
          endValue: mp.max,
          exchange: purchaseExchg[mp.pos]
        });
      })
      .catch(err => console.error(`Promise.all: ${err}`))
    });
  }


  // Compute the triangular arbitrage, obtain the best sequence of trades
  async function triangleArbitration(symbolList, startValue, exchanges) {
    if (symbolList.length<2) return;
    let tradeValue = startValue;
    let trades = [];
    for(let pos=0; pos<symbolList.length; pos++) {
      const symbolPair = [ symbolList[pos], symbolList[(pos+1)%symbolList.length] ];
      console.log(`${symbolPair}`);
      let thisTrade = await arbitrationProfit(symbolPair, tradeValue, exchanges);
      trades.push(thisTrade);
      tradeValue = thisTrade.endValue;
    }
    console.log(trades);
    console.log(`Net profit: ${tradeValue-startValue}`);
    return trades;
  }



  return (
    <div className="App">
      <header className="App-header">
        <h1>Arbitrage Calculator</h1>
      </header>
      <section>
        <div className="container">
          <div className="left">
          </div>
          <div className="center">
            <br/>
            <br/>
            <form onSubmit={handleSubmit}>
              <ul className="wrapper">
                <li className="form-row"><label htmlFor="s1">Symbol1</label><input type="text" id="s1" name="s1" defaultValue="KNC" maxLength="5"/></li>
                <li className="form-row"><label htmlFor="s2">Symbol2</label><input type="text" id="s2" name="s2" defaultValue="BAT" maxLength="5"/></li>
                <li className="form-row"><label htmlFor="s3">Symbol3</label><input type="text" id="s3" name="s3" defaultValue="SAI" maxLength="5"/></li>
                <li className="form-row"><label htmlFor="amount">Initial amount</label><input type="number" id="amount" name="startValue" defaultValue="1000" /></li>
                <li className="form-row"><input type="submit" value="Calculate"/></li>
              </ul>
            </form>
            <br/>
            <hr/>
            <br/>
            <p>The optimal arbitrage profit: {bestArbitrageProfit}</p>
            <ol>{ bestArbitrageTrade.map((x,i) => <li key={i}>{x}</li>) }</ol>
          </div>
          <div className="right">
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
