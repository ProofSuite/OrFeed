# OrFeed

[![Discord](https://img.shields.io/discord/671195829524103199)](https://discord.gg/byCPVsY)

## Децентрализованная Ценовая Лента и Поставщик Данных Веб-Сайта для Смарт-Контрактов, Которые Нуждаются в Финансовой, Спортивной и Другой Разнообразной Информации, Которая Находится внутри и/или вне Цепи.

Высоконадежный агрегатор оракулов для приложений DeFi на базе Ethereum, которым требуются финансовые данные из внешнего мира.

![OrFeed Logo](https://www.orfeed.org/images/orfeed.png)


Вебсайт: [orfeed.org](https://www.orfeed.org)

## [Опробовать](https://www.orfeed.org/explorer) OrFeed

[![Кнопка Тест-Драйва](https://www.orfeed.org/images/testdrive.png)](https://www.orfeed.org/explorer)


[Камень Реальности на блокчейне](https://medium.com/proof-of-fintech/the-reality-stone-on-the-blockchain-accessible-to-all-1654a3ec71a7) блог

[Как OrFeed Был Задуман](https://medium.com/proof-of-fintech/introducing-orfeed-aa323342d34c) блог

[Вариант использования](https://medium.com/proof-of-fintech/how-a-penny-can-affect-billions-a88c0837d17e) блог

[OrFeed DAO](https://medium.com/proof-of-fintech/why-defi-needs-an-oracle-management-dao-8eec65c2e15b) блог с предложением


Интерфейс Etherscan Smart Contract: [https://etherscan.io/dapp/0x8316b082621cfedab95bf4a44a1d4b64a6ffc336](https://etherscan.io/dapp/0x8316b082621cfedab95bf4a44a1d4b64a6ffc336) (Подсказка: getExchangeRate - хорошее место для начала)

Реестр Оракулов [dApp](https://etherscan.io/dapp/0x74b5ce2330389391cc61bf2287bdc9ac73757891)

[Youtube обучающее видео](https://youtu.be/LK1BiSveEI4)


## Начало использования

В верхнюю часть смарт-контракта или в файл, на который ссылается проект dApp, вставьте этот интерфейс.

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


Чтобы инициализировать OrFeed, просто добавьте этот код:

```javascript
OrFeedInterface orfeed= OrFeedinterface(0x8316b082621cfedab95bf4a44a1d4b64a6ffc336);

```

Одна из лучших особенностей OrFeed заключается в том, что OrFeed автоматически определяет, какой тип актива вы ищете (хотя данные могут поступать от разных поставщиков), в качестве параметра "venue" при выполнении вызова `getExchangeRate`. Например, вы можете получить цену для ETH / USD так же, как вы получаете цену для JPY / ETH. Третий параметр - место. Используйте пустой ('') для оракула по умолчанию. В будущем вы можете ссылаться на несколько мест/поставщиков, чтобы получить их данные и убрать слишком сильно отличающиеся от средних.

```javascript
uint jpyusdPrice = orfeed.getExchangeRate("JPY", "USD", "DEFAULT", 100000);
// returns 920 (or $920.00)
```

Примечание: Замените "DEFAULT" провайдером оракула, от которого вы хотите получать данные. Например, если вы хотите узнать цену Uniswap на стороне покупки, используйте "BUY-UNISWAP-EXCHANGE". Если вы хотите, чтобы данные о продажах в Kyber были одинаковыми, вы можете использовать "SELL-KYBER-EXCHANGE". Поскольку у ERC-20 много, много целых чисел, при получении цены от токена к токену обязательно используйте очень большие суммы ... 1000000000 DAI меньше, чем, например, один пенни из-за делимости на 18. 

Ещё примеры:

```javascript
uint price = orfeed.getExchangeRate("ETH", "USDC", "BUY-KYBER-EXCHANGE", 100000000000000);
```

```javascript
uint price = orfeed.getExchangeRate("BTC", "DAI", "SELL-UNISWAP-EXCHANGE", 100);
```

```javascript
uint price = orfeed.getExchangeRate("MKR", "EUR", "", 100000000000000);
```


Экспериментально:


```javascript
uint price = orfeed.getExchangeRate("AAPL", "USD", "PROVIDER1", 1);
```


Кроме того, вы можете создавать хитрые вещи, например генерировать случайное число между двумя числами, используя метод getExchangeRate, который вызывает 'random' пространство имен оракула в реестре оракулов, а затем вычисляет число на основе метки времени блока, сложности блока, также как и динамическая цена BTC, ETH и DAI на Kyber (часто изменяется во время синтаксического анализа блока, поэтому будет сложнее в реализации, чем обычный хэш-блока-времени / метода сложности):

```javascript
uint price = orfeed.getExchangeRate("10", "50", "random", 0);
```



## RESTful API

Вы можете получить доступ к функциям getExchangeRate с помощью вызовов RESTful API. например:
```javascript
https://api.orfeed.org/getExchangeRate?fromSymbol=JPY&toSymbol=USD&venue=DEFAULT&amount=10000000000000000
```

В ближайшее время в RESTful calls будут добавлены дополнительные функции смарт-контрактов OrFeed. Вы можете найти исходный код для Node.JS API приложения в /nodeJSAppExamples/orfeedapi




## Предоставление данных в качестве поставщика-оракула

Вы можете зарегистрировать имя поставщика и подключить его к своему пользовательскому контракту oracle (DNS-style) через реестр Orfeed Оракулов: [здесь](https://etherscan.io/dapp/0x74b5ce2330389391cc61bf2287bdc9ac73757891) путем вызова функции registerOracle. 
Кроме того, вы можете передать имя оракула, предоставить контактные данные на случай, если вы планируете его продать, и найти других поставщиков-оракулов с помощью смарт-контракта.Пример смарт-контракта оракула, совместимого с прокси-контрактом OrFeed, можно найти в файле /contracts/examples/ProvideDataExamples/userGeneratedOracleExample.sol (очень простой пример, который либо возвращает 500, либо 2)
После того как вы развернете свой контракт и зарегистрируете его в реестре (заплатив небольшую сумму ETH, чтобы предотвратить спам имен), вы можете проверить/подтвердить свою регистрацию, вызвав функцию getOracleAddress.

Поскольку в реестре OrFeed регистрируются более надежные, а также не требующие доверия смарт-контракты оракулы, мы обновим новый список в качестве справочного материала.


## Примеры источников и активов (в настоящее время на MainNet)


| Asset       | Example Provider (Venue)           | Type  |
| ------------- |:-------------:| -----:|
| ETH      | DEFAULT | Cryptocurrency |
| BTC      | DEFAULT | Cryptocurrency |
| DAI      | BUY-KYBER-EXCHANGE      |   Token |
| USDC | SELL-UNISWAP-EXCHANGE    |    Token |
| MKR      | DEFAULT | Token |
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



contract/pegTokenExample.sol содержит код шаблона и ссылку на действующий контракт для токена, использующего данные OrFeed, привязанные к стоимости автономного актива (акции Alibaba в Примере). Мы с нетерпением ждем менее примитивных примеров, которые используют DAOs, передовые методы обеспечения и т. д. Кроме того, contracts/levFacility.sol находится на очень ранних стадиях и является началом создания токена, который имеет встроенный кредитный механизм с коротким/длинным кредитным плечом для маржинальной торговли фьючерсами, урегулированными данными OrFeed (очень рано).

Примечание: "PROVIDER1" был первым внешним поставщиком финансовых данных для системы оракулов, и вы можете проверить обновления с этого адреса в главной сети: 0xc807bef0cc81911a34b1a9a0dad29fd78fa7e703. Пример кода для запуска собственного оракула внешних данных находится в /contracts/examples/ProvideDataExamples/stockETFPriceContract.sol (умный контракт) и /contract/examples/oraclenodeExampleApp (для приложения узла для взаимодействия с этим умным контрактом)



## Примеры

Папка contract/examples содержит контракты как для записи данных в качестве поставщика-оракула, так и для использования данных в качестве потребителя оракула.

Папка /nodeJSAppExamples содержит приложения Node.js, которые взаимодействуют со смарт-контрактами, которые либо читают, либо записывают данные оракула.



## Получение данных от [Chainlink](https://chain.link/) через OrFeed

Вы можете получать данные с веб-сайта (off-chain) асинхронно через интеграцию Chainlink. Чтобы использовать эту функцию, выполните следующие действия:

1. Убедитесь, что у вас есть [LINK] (https://etherscan.io/token/0x514910771af9ca656af840dff83e8264ecf986ca) монеты в вашем кошельке, из которого вы делаете запрос. Если у вас нет LINK, вы можете посетить Uniswap.io или Kyberswap, чтобы конвертировать Ether в LINK. Вам потребуется .1 LINK на запрос.

2.Одобрите контракт OrFeed Chainlink прокси, чтобы использовать ваши монеты LINK для оплаты сборов Chainlink. Посетите [https://etherscan.io/token/0x514910771af9ca656af840dff83e8264ecf986ca#writeContract](https://etherscan.io/token/0x514910771af9ca656af840dff83e8264ecf986ca#writeContract) и используйте "Approve" функцию.В поле "_spender" вставьте этот адрес: 0xa0f806d435f6acaf57c60d034e57666d21294c47. В поле "_amount" введите: 100000000000000000000000000. Кроме того, в верхней части страницы, прямо над функцией подтверждения, обязательно нажмите «Подключиться к Web3».

Дополнительно, для субсидированных комиссий LINK, вы можете использовать токен PRFT для оплаты сборов (.01 PRFT за запрос). Посетите [https://etherscan.io/token/0xc5cea8292e514405967d958c2325106f2f48da77#writeContract](https://etherscan.io/token/0xc5cea8292e514405967d958c2325106f2f48da77#writeContract) и воспользуйтесь "Approve" функцией так же, как вы сделали бы с LINK, в примере выше.




Теперь вы готовы!

```javascript
string status = orfeed.requestAsyncEvent("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD", "CHAINLINK");
```

После 1-3 блоков Chainlink отправит данные веб-сайта в OrFeed, и вы сможете получить доступ к этим данным без совершения транзакции (синхронно). Кроме того, вы можете получить доступ к данным с веб-сайтов, которые другие уже оплатили, введя свой URL.

```javascript
string result = orfeed.getAsyncEventResult("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD", "CHAINLINK", "");
```

Подобные интеграции с Augur, Provable и Band Protocol скоро появятся.


Как только ваша транзакция будет подтверждена в блокчейне, Chainlink ожидает 1-3 блока и отправляет ответ от их умного контракта.



## Тестирование

Чтобы проверить, хорошо ли работают контракты в соответствующих сетях, выполните следующие действия:

1. Установите `node.js` в вашей системе/среде, если он еще не установлен.
2. Установите truffle and globall, как только `node.js` закончит установку, т.е.` yarn global add truffle`, а затем установите проект dev-dependencies, то есть `yarn install`
3. Создайте файл `.secrets` в корневой папке этого проекта и вставьте в него `мнемоническую фразу` кошелька, который вы хотите использовать для тестирования в соответствующей сети, например: mainnet, kovan или rinkeby.
4. Введите infura `project-ID` для проекта infura, который вы используете для тестирования в любой из сетей, в файле `truffle-config.js`.
5. Убедитесь, что в кошельке достаточно eth для тестирования. Примерно `$5` должно быть достаточно как для развертывания контракта, так и для тестирования.
6. Наконец, выполните одну из следующих команд для проверки контрактов, в зависимости от сети:
  - `truffle test --mainnet` для основной сети ethereum будьте осторожны, так как это будет стоить вам реальных денег.
  - `truffle test --kovan` для тестовой сети kovan.
  - `truffle test --rinkeby` для тестовой сети rinkeby.
  
### Прочитайте полную документацию [orfeed.org/docs](https://www.orfeed.org/docs)

Распространенными поставщиками данных по умолчанию, когда параметры места остаются пустыми, являются Kyber, Uniswap, Chainlink и Synthetix.

Будущие частные/премиум-данные могут быть предоставлены следующим образом (хотя мы ожидаем предложений и приглашаем вас присоединиться к OrFeed DAO, где мы будем голосовать за будущие управленческие решения):

![Как все это сочетается](https://www.orfeed.org/images/diagram.png)

### Демо на тестовых сетях

Они часто могут устаревать, так как мы используем подход MainNet-first, так как большая часть функциональности OrFeed не требует gas, поскольку OrFeed служит прокси для многих других контрактов.

**Kovan**: [0x31a29958301c407d4b4bf0d53dac1f2d154d9d8d](https://kovan.etherscan.io/address/0x31a29958301c407d4b4bf0d53dac1f2d154d9d8d)  
**Rinkeby**: [0x97875355ef55ae35613029df8b1c8cf8f89c9066](https://rinkeby.etherscan.io/address/0x97875355ef55ae35613029df8b1c8cf8f89c9066) 


### Работы, которые вдохновляли нас во время развития:

[William George, Clément Lesaege: Smart Contract Oracle for Approximating Real-World, Real Number Values](http://drops.dagstuhl.de/opus/volltexte/2019/11396/pdf/OASIcs-Tokenomics-2019-6.pdf)

[Aragon Network Whitepaper](https://github.com/aragon/whitepaper)

[Vitalik Buterin: Minimal Anti-Collusion Infrastructure](https://ethresear.ch/t/minimal-anti-collusion-infrastructure/5413)


## Разработка

Исходный код OrFeed [licensed under the Apache 2.0 license](https://github.com/ProofSuite/OrFeed/blob/master/LICENSE), и мы приветствуем любой вклад в развитие.

Предпочтительной ветвью pull-запросов является ветвь 'develop'. Кроме того, мы часто добавляем небольшие вознаграждения на Gitcoin для критически важных инициатив.

Спасибо, вы потрясающий!
