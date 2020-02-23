# OrFeed

[![Discord](https://img.shields.io/discord/671195829524103199)](https://discord.gg/byCPVsY)

## 재무, 스포츠 및 기타 기타 정보가 필요한 스마트 계약에 대한 분산 가격 공급 및 웹 사이트 데이터 제공업체로, 이 정보는 체인 및/또는 오프라인 상태에 있습니다.

외부 세계의 재무 데이터가 필요한 Ethereum 기반 DeFi 애플리케이션을 위한 매우 안정적인 Oracle 통합 솔루션.

![OrFeed Logo](https://www.orfeed.org/images/orfeed.png)


웹 사이트: [orfeed.org](https://www.orfeed.org)

## [사용해보십시오](https://www.orfeed.org/explorer) OrFeed

[![Test Drive Button](https://www.orfeed.org/images/testdrive.png)](https://www.orfeed.org/explorer)


[블록체인의 현실](https://medium.com/proof-of-fintech/the-reality-stone-on-the-blockchain-accessible-to-all-1654a3ec71a7) 블로그

[OrFeed가 어떻게 생각되었는지](https://medium.com/proof-of-fintech/introducing-orfeed-aa323342d34c) 블로그

[사용 사례](https://medium.com/proof-of-fintech/how-a-penny-can-affect-billions-a88c0837d17e) 블로그

[OrFeed DAO](https://medium.com/proof-of-fintech/why-defi-needs-an-oracle-management-dao-8eec65c2e15b) proposal 블로그


Etherscan 스마트 계약 인터페이스: [https://etherscan.io/dapp/0x8316b082621cfedab95bf4a44a1d4b64a6ffc336](https://etherscan.io/dapp/0x8316b082621cfedab95bf4a44a1d4b64a6ffc336) (Helper: getExchangeRate is a good place to start)

오라클 가격 / 숫자 데이터 레지스트리: [dApp](https://etherscan.io/dapp/0x74b5ce2330389391cc61bf2287bdc9ac73757891)

일반 데이터 / 이벤트 결과 레지스트리: [dApp](https://etherscan.io/address/0xd754f58d9d6d705b98bde698f9f9cec0bded1b8a#writeContract) 

[YouTube 비디오 자습서](https://youtu.be/LK1BiSveEI4)


## 시작.

스마트 계약 맨 위 또는 dApp 프로젝트의 참조된 파일에 이 인터페이스를 포함합니다.

```javascript
interface OrFeedInterface {
  function getExchangeRate ( string fromSymbol, string toSymbol, string venue, uint256 amount ) external view returns ( uint256 );
  function getTokenDecimalCount ( address tokenAddress ) external view returns ( uint256 );
  function getTokenAddress ( string symbol ) external view returns ( address );
  function getSynthBytes32 ( string symbol ) external view returns ( bytes32 );
  function getForexAddress ( string symbol ) external view returns ( address );
  function requestAsyncEvent(string eventName, string source)  external returns(string);
  function getAsyncEventResult(string eventName, string source, string referenceId) external view returns (string);
}
```


OrFeed를 초기화하려면 다음 코드를 포함하기만 하면 됩니다.

```javascript
OrFeedInterface orfeed= OrFeedinterface(0x8316b082621cfedab95bf4a44a1d4b64a6ffc336);

```

OrFeed의 가장 좋은 점 중 하나는 OrFeed가 getExchangeRate 호출을 수행할 때 "venue"의 매개 변수로, 사용자가 찾고 있는 자산 종류를 자동으로 감지한다는 것입니다(데이터가 다른 공급자로부터 올 수 있음).예를 들어, JPY/ETH에 대한 가격을 얻는 것과 같은 방법으로 ETH/USD에 대한 가격을 얻을 수 있습니다.세 번째 매개 변수는 venue입니다.기본 oracle에는 빈('')을 사용합니다.미래에는, 당신은 그들의 데이터를 얻고 평균으로부터 너무 멀리 벗어난 어떤 것을 버리려고 몇몇 장소와 제공자들을 참조할 수 있습니다.

```javascript
uint jpyusdPrice = orfeed.getExchangeRate("JPY", "USD", "DEFAULT", 100000);
// returns 920 (or $920.00)
```

참고:"기본값"을 oracle 공급자로 대체하여 데이터를 원합니다. 예를 들어,Uniswap 의 가격을 구매 측에 알고 싶다면"구매-UNISWAP-EXCHANGE"를 사용하십시오. Khyber 의 판매 측 데이터를 동일시하려면"판매 KHIBER-EXCHANGE"를 사용할 수 있습니다. Bancor 가 스왑/유동성 경로와 함께 작동하는 방식 때문에 Bancor 를 쿼리 할 때 단순히"BANCOR"를 사용할 수 있습니다. ERC-20s 는 토큰에서 토큰으로 가격을 매길 때 많은 정수를 가지고 있기 때문에 매우 많은 양을 사용하십시오.... 1000000000DAI 는 예를 들어 18 에서 가독성으로 인해 1 페니 미만입니다.

추가 예제:

```javascript
uint price = orfeed.getExchangeRate("ETH", "USDC", "BUY-KYBER-EXCHANGE", 100000000000000);
```

```javascript
uint price = orfeed.getExchangeRate("BTC", "DAI", "SELL-UNISWAP-EXCHANGE", 100);
```

```javascript
uint price = orfeed.getExchangeRate("ETH", "DAI", "BANCOR", 1000000000000000);
```

```javascript
uint price = orfeed.getExchangeRate("MKR", "EUR", "", 100000000000000);
```


실험적:


```javascript
uint price = orfeed.getExchangeRate("AAPL", "USD", "PROVIDER1", 1);
```


또한 Synthetix의`gasPriceLimit`를 쿼리하여 dApp 내에서 전면 실행을 방지하는 "안전한"가스 가격 검색과 같은 고급 작업을 수행 할 수 있습니다.


```javascript
uint gasLimit = orfeed.getExchangeRate("skip", "skip", "synthetix-gas-price-limit", 0);
```


## 데이터 및 이벤트 Oracle.

가격 및 수치 데이터 외에도 문자열 데이터는`getEventResult`가져 오기 방법을 사용하여 검색 할 수 있습니다. 당신이 얻을 수 있는 문자열 데이터를 등록하거나 피드라클(수 있는 선택적으로 노는 방법에 대한 그들의 오라클이 작동 및 기타 상세정보). 이를 위해 사용될 수 있 스포츠 이벤트,문서,메모하는 한 저장하고 이를 영구적으로/temprarily 만료한 때 외국인이 와서 원하는 데이터에 무엇이 인간이었습니다. 당신이 등록할 수 있습 통해 oracle 이 OrFeed[dApp](https://etherscan.io/address/0xd754f58d9d6d705b98bde698f9f9cec0bded1b8a#writeContract 다)및 세 툴레스 벡에 대한 방법을 반환에 따라 데이터를 보낸 매개 변수(예:/약/예/ProvideDataExamples/userRegisteredDataOrEventOracleExample.졸). 데이터 예제 검색 사용:


```javascript
string memory info = orfeed.getEventResult("skip", "satoshi-first-block");
```
Returns: The Times 03/Jan/2009 Chancellor on brink of second bailout for banks



## RESTful API

RESTful API 호출을 통해 getExchangeRate 기능에 액세스 할 수 있습니다. 예를 들어:

```javascript
https://api.orfeed.org/getExchangeRate?fromSymbol=JPY&toSymbol=USD&venue=DEFAULT&amount=10000000000000000
```

OrFeed 의 더 많은 스마트 계약 기능이 곧 편안한 호출에 추가됩니다. 당신은 노드의 소스 코드를 찾을 수 있습니다.노드에서 js API 앱 JS 앱 예제/또는 피드 api.



## Oracle 제공자로서 데이터 제공

OrFeed Oracle Registry를 통해 제공자 이름을 등록하고이를 사용자 정의 Oracle 계약 (DNS 스타일)에 연결할 수 있습니다. [here] (https://etherscan.io/dapp/0x74b5ce2330389391cc61bf2287bdc9ac73757891) registerOracle 함수를 호출하여
또한 Oracle 이름을 전달하고 판매를 고려중인 경우 연락처 정보를 제공하며 스마트 계약을 통해 다른 Oracle 제공자를 찾을 수 있습니다.
OrFeed 프록시 계약과 호환되는 Oracle 스마트 계약의 예는 /contracts/examples/ProvideDataExamples/userGeneratedOracleExample.sol에 있습니다 (500 또는 2를 반환하는 매우 간단한 예).
계약을 배포하고 레지스트리에 등록하면 (이름의 스팸 방지를 위해 소량의 ETH를 지불 함) getOracleAddress 함수를 호출하여 등록을 확인 / 확인할 수 있습니다.

으로 더 많은 평판뿐만 아니라,신용이없는,oracle 스마트 계약서 등록에 OrFeed 레지스트리에,우리는 것입 업데이트 새로 목록을 참조합니다.


## 소스 및 자산 예(현재 MainNet에 있음)



|  자산       |    예제 공급자(상태)           |  유형  |
| ------------- |:-------------:| -----:|
| ETH      | DEFAULT | Cryptocurrency |
| BTC      | DEFAULT | Cryptocurrency |
| DAI      | BUY-KYBER-EXCHANGE      |   Token |
| USDC | SELL-UNISWAP-EXCHANGE    |    Token |
| MKR      | BANCOR | Token |
| KNC      | DEFAULT      |   Token |
| ZRX | DEFAULT    |    Token |
| TUSD | DEFAULT    |    Token |
| SNX | DEFAULT    |    Token |
| CUSDC | DEFAULT    |    Token |
| BAT | DEFAULT    |    Token |
| OMG | DEFAULT    |    Token |
| SAI | DEFAULT    |    Token |
| JPY | DEFAULT    |    Forex |
| EUR | DEFAULT    |    Forex |
| CHF | DEFAULT    |    Forex |
| USD | DEFAULT    |    Forex |
| GBP | DEFAULT    |    Forex |
| AAPL | PROVIDER1    |    Equity |
| MSFT | PROVIDER1    |    Equity |
| GOOGL | PROVIDER1    |    Equity |
| NFLX | PROVIDER1    |    Equity |
| BRK.A | PROVIDER1    |    Equity |
| FB | PROVIDER1    |    Equity |
| BABA | PROVIDER1    |    Equity |
| V | PROVIDER1    |    Equity |
| JNJ | PROVIDER1    |    Equity |
| TSLA | PROVIDER1    |    Equity |
| JPM | PROVIDER1    |    Equity |
| DIS | PROVIDER1    |    Equity |
| SPX | PROVIDER1    |    ETF |
| VOO | PROVIDER1    |    ETF |
| QQQ | PROVIDER1    |    ETF |
| GLD | PROVIDER1    |    ETF |
| VXX | PROVIDER1    |    ETF |



상위 20 개의 ERC-20 개의 토큰을 사용할 수 있습니다.

contracts/pegTokenExample.sol 오프 체인 자산(예제의 Alibaba Stock)의 값에 페깅된 OrFeed 데이터를 사용하는 토큰에 대한 템플릿 코드 및 라이브 계약 참조를 포함합니다. DAO와 고급 콜라테르화 기술 등을 활용하는 덜 원시적인 예를 기대하고 있습니다. 또한 contracts/levFacility.sol은 매우 초기 단계에 있으며 OrFeed 데이터(매우 초기)에 의해 정해지는 선물용 차익/장기 신용 거래를 위한 내장된 토큰으로 구성됩니다.

참고:"PROVIDER1"은 OrFeed oracle 시스템의 첫 번째 외부 재무 데이터 공급자로, mainnet의 이 주소에서 업데이트를 확인할 수 있습니다.0xc807bef0cc81911a34b1a9a0dad29fd78fa7e703사용자 고유의 외부 데이터 oracle을 실행하는 코드 예제는 /contracts/examples/ProvideDataExamples/stockETFPriceContract.sol(스마트 계약) 및 /contracts/example/oraclenodeExampleApp(노드 응용 프로그램이 해당 스마트 계약과 인터페이스하는 경우)에 있습니다.



## DeFi 금리 데이터 / 계산기.

곧 온다.



## 예제

계약/예제 폴더에는 Oracle 공급자로 데이터를 작성하고 Oracle 소비자로서 데이터를 소비하는 계약이 포함되어 있습니다.

/nodeJSAppExamples 폴더에는 Oracle 데이터를 읽거나 쓰는 스마트 계약과 인터페이스하는 Node.js 앱이 포함되어 있습니다.



## OrFeed를 통해 [Chainlink] (https://chain.link/)에서 데이터 가져 오기

Chainlink 통합을 통해 웹 사이트 (오프라인)에서 비동기 적으로 데이터를 검색 할 수 있습니다. 이 기능을 사용하려면 다음 단계를 수행하십시오.

1. 지갑에 [LINK] (https://etherscan.io/token/0x514910771af9ca656af840dff83e8264ecf986ca) 동전이 있는지 확인하십시오. LINK가없는 경우 Uniswap.io 또는 Kyberswap을 방문하여 Ether을 LINK로 변환 할 수 있습니다. 요청 당 .1 LINK가 필요합니다.

2. OrFeed Chainlink 대표 계약에 동의하여 LINK 코인을 사용하여 Chainlink 수수료를 지불하십시오. "승인"기능을 사용하려면 [https://etherscan.io/token/0x514910771af9ca656af840dff83e8264ecf986ca#writeContract](https://etherscan.io/token/0x514910771af9ca656af840dff83e8264ecf986ca#writeContract)를 방문하십시오. 주소 0xa0f806d435f6acaf57c60d034e57666d21294c47을 "_spender"필드에 붙여 넣습니다. "_amount"필드에 100000000000000000000000000을 입력하십시오. 페이지 상단의 인증 기능 바로 위에있는 Web3에 연결을 클릭 할 수도 있습니다.

선택적으로 보조금이 지급되는 LINK 수수료의 경우 PRFT 토큰 (요청 당 0.01 PRFT)을 사용하여 수수료를 지불 할 수 있습니다. 동일한 인증 방법을 사용하려면 [https://etherscan.io/token/0xc5cea8292e514405967d958c2325106f2f48da77#writeContract](https://etherscan.io/token/0xc5cea8292e514405967d958c2325106f2f48da77#writeContract)를 방문하십시오.


이제 준비되었습니다!


```javascript
string status = orfeed.requestAsyncEvent("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD", "CHAINLINK");
```

After 1 to 3 blocks, Chainlink will send the website data to OrFeed and you can access that data without making a transaction (synchronously). Additionally, you can access data from websites that others have already paid for by inputting their the URL.

```javascript
string result = orfeed.getAsyncEventResult("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD", "CHAINLINK", "");
```

Similar integrations with Augur, Provable and Band Protocol are coming soon.


Once your transaction has been confirmed on the blockchain, Chainlink then waits 1-3 blocks and sends the response from their smart contract.



## 테스트

계약이 각 네트워크에서 제대로 작동하는지 테스트하려면 다음을 수행하십시오.

1. 시스템 / 환경에`node.js '가 설치되어 있지 않으면 설치하십시오.
2.`node.js`가`yarn global add truffle` 설치를 완료 한 후 truffle globall을 설치 한 다음, 프로젝트 dev-dependencies (예 :`yarn install)를 설치하십시오.
3.이 프로젝트의 루트 폴더에`.secrets` 파일을 생성하고 각각의 네트워크, 즉 메인 넷, 코반 또는 링크 비에서 테스트에 사용하려는 지갑의 니모닉 문구를 붙여 넣습니다.
4. truffle-config.js 파일에 네트워크 중 하나에서 테스트하는 데 사용하는 infura 프로젝트의 infura`project-ID`를 입력하십시오.
5. 지갑에 테스트를위한 충분한 윤리가 있는지 확인하십시오. Atleast`$ 5`는 계약 배포 및 테스트에 충분해야합니다.
6. 마지막으로 다음 명령 중 하나를 실행하여 네트워크에 따라 계약을 테스트하십시오.
메인 이더넷 네트워크를위한 트러플 테스트-메인 넷.
kovan 테스트 네트워크에 대한 트러플 테스트 --kovan.
rinkeby 테스트 네트워크에 대한`truffle test --rinkeby`.

### 전체 문서 읽기 [orfeed.org/docs](https://www.orfeed.org/docs)

장소 매개 변수가 비어있는 경우 일반적인 기본 데이터 제공자는 Kyber, Uniswap, Chainlink 및 Synthetix입니다.

향후 개인 / 프리미엄 데이터는 다음과 같이 제공 될 수 있습니다 (우리는 제안을하지만 향후 거버넌스 결정에 투표 할 OrFeed DAO에 참여하도록 환영합니다).


![How it all fits together](https://www.orfeed.org/images/diagram.png)

### 테스트넷에 대한 데모

OrFeed가 다른 많은 계약에 대한 대리 역할을하기 때문에 대부분의 OrFeed 기능에는 가스가 필요하지 않기 때문에 MainNet 우선 접근 방식을 사용하기 때문에 이러한 정보는 종종 오래된 것입니다.

**Kovan**: [0x31a29958301c407d4b4bf0d53dac1f2d154d9d8d](https://kovan.etherscan.io/address/0x31a29958301c407d4b4bf0d53dac1f2d154d9d8d)  
**Rinkeby**: [0x97875355ef55ae35613029df8b1c8cf8f89c9066](https://rinkeby.etherscan.io/address/0x97875355ef55ae35613029df8b1c8cf8f89c9066) 


### 개발을 통해 사상의 영감으로 제공된 작품들:

[William George, Clément Lesaege: Smart Contract Oracle for Approximating Real-World, Real Number Values](http://drops.dagstuhl.de/opus/volltexte/2019/11396/pdf/OASIcs-Tokenomics-2019-6.pdf)

[Aragon Network Whitepaper](https://github.com/aragon/whitepaper)

[Vitalik Buterin: Minimal Anti-Collusion Infrastructure ](https://ethresear.ch/t/minimal-anti-collusion-infrastructure/5413)


## 기여

OrFeed's source code is [licensed under the Apache 2.0 license](https://github.com/ProofSuite/OrFeed/blob/master/LICENSE), and we welcome contributions.

The preferred branch of pull requests is the `develop` branch. Additionally, we are frequently adding small bounties on Gitcoin for mission-critical initiatives.

Thanks for being awesome!
