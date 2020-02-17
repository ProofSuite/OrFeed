
//test contract concept for leveraged positions of a token built-into an erc-20, with long/short capability... pegged to an external asset.

interface OrFeedInterface {
  function getExchangeRate ( string fromSymbol, string toSymbol, string venue, uint256 amount ) external view returns ( uint256 );
  function getTokenDecimalCount ( address tokenAddress ) external view returns ( uint256 );
  function getTokenAddress ( string symbol ) external view returns ( address );
  function getSynthBytes32 ( string symbol ) external view returns ( bytes32 );
  function getForexAddress ( string symbol ) external view returns ( address );
}


interface IKyberNetworkProxy {
    function maxGasPrice() external view returns(uint);
    function getUserCapInWei(address user) external view returns(uint);
    function getUserCapInTokenWei(address user, ERC20 token) external view returns(uint);
    function enabled() external view returns(bool);
    function info(bytes32 id) external view returns(uint);
    function getExpectedRate(ERC20 src, ERC20 dest, uint srcQty) external view returns (uint expectedRate, uint slippageRate);
    function tradeWithHint(ERC20 src, uint srcAmount, ERC20 dest, address destAddress, uint maxDestAmount, uint minConversionRate, address walletId, bytes hint) external payable returns(uint);
    function swapEtherToToken(ERC20 token, uint minRate) external payable returns (uint);
    function swapTokenToEther(ERC20 token, uint tokenQty, uint minRate) external returns (uint);
}


interface ERC20 {
    function totalSupply() public view returns (uint supply);
    function balanceOf(address _owner) public view returns (uint balance);
    function transfer(address _to, uint _value) public returns (bool success);
    function transferFrom(address _from, address _to, uint _value) public returns (bool success);
    function approve(address _spender, uint _value) public returns (bool success);
    function allowance(address _owner, address _spender) public view returns (uint remaining);
    function decimals() public view returns(uint digits);
    event Approval(address indexed _owner, address indexed _spender, uint _value);
}
library SafeMath {
  function mul(uint256 a, uint256 b) internal constant returns (uint256) {
    uint256 c = a * b;
    assert(a == 0 || c / a == b);
    return c;
  }

  function div(uint256 a, uint256 b) internal constant returns (uint256) {
    assert(b > 0); // Solidity automatically throws when dividing by 0
    uint256 c = a / b;
    assert(a == b * c + a % b); // There is no case in which this doesn't hold
    return c;
  }

  function sub(uint256 a, uint256 b) internal constant returns (uint256) {
    assert(b <= a);
    return a - b;
  }

  function add(uint256 a, uint256 b) internal constant returns (uint256) {
    uint256 c = a + b;
    assert(c >= a);
    return c;
  }
}

    // ERC20 Token Smart Contract
    contract PegToken {
        
        string public constant name = "Synthetic Alibaba Equity Tokens";
        string public constant symbol = "BABA";
        uint8 public constant decimals = 3;
        uint public _totalSupply = 0;
        //rate will change
        uint256 public RATE = 0;
        bool public isMinting = true;
        bool public isExchangeListed = false;
        OrFeedInterface orfeed= OrFeedInterface(0x8316b082621cfedab95bf4a44a1d4b64a6ffc336);
        
        using SafeMath for uint256;
        address public owner;
        
         // Functions with this modifier can only be executed by the owner
         modifier onlyOwner() {
            if (msg.sender != owner) {
                throw;
            }
             _;
         }
     
        // Balances for each account
        mapping(address => uint256) balances;
        // Owner of account approves the transfer of an amount to another account
        mapping(address => mapping(address=>uint256)) allowed;
        
        mapping(address => uint256) daiCanLBurnToNow;
        mapping(address => uint256) daiAsCollateralInitial;
        mapping(address => uint256) canUnCollateralizeWhen;
        mapping(address => uint256 [4]) positions;
        IKyberNetworkProxy kyberProxy;
        ERC20 eth;
        ERC20 dai;
         address kyberProxyAddress;
         uint256 totalInPositions =0;
         uint256 totalInCollateralizerClaimPool = 0;
             
       

        // Constructor
        constructor() public  {
            owner = msg.sender; 
            balances[owner] = _totalSupply;
            kyberProxyAddress = 0x818E6FECD516Ecc3849DAf6845e3EC868087B755;
            
              kyberProxy = IKyberNetworkProxy(kyberProxyAddress);
            eth = ERC20(0x00eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee);
              dai = ERC20(0x6b175474e89094c44da98b954eedeac495271d0f);
              
             
        }

       


        // This function creates Tokens  
         function createTokens() external payable {
            if(isMinting == true){
                require(msg.value > 0);
                RATE = getETH2TokenRate();
                uint256 tokens = msg.value.div(1000000000000000).mul(RATE).div(1000000);
                uint256 amountSubFromCollateral = tokens.div(3);
                uint256 tokens2Issue = tokens.sub(amountSubFromCollateral);
                
                _totalSupply = _totalSupply.add(tokens2Issue);
                balances[msg.sender] = balances[msg.sender].add(tokens2Issue);
                Transfer(this, msg.sender, tokens2Issue);
                convertForCollateral(msg.value);
            }
            else{
                throw;
            }
        }

        function convertForCollateral(uint256 amount) internal returns (bool){
           
            require(daiCanLBurnToNow[msg.sender] == 0x0, "Only one collateralization per account");
            bytes memory PERM_HINT = "PERM";
             
             
              uint daiAmount = kyberProxy.tradeWithHint.value(amount)(eth, amount, dai, this, 8000000000000000000000000000000000000000000000000000000000000000, 0, 0x0000000000000000000000000000000000000004, PERM_HINT);
                uint256 daiCollateral = daiAmount.div(3);
                uint256 daiCanBurnTo  = daiAmount.sub(daiCollateral);
                daiCanLBurnToNow[msg.sender].add(daiCanBurnTo);
                daiAsCollateralInitial[msg.sender].add(daiCollateral);
                canUnCollateralizeWhen[msg.sender] = block.timestamp.add(30 days);
               
                
                
        }
        
        function burnTokens(uint256 amount){
             require(balances[msg.sender] >= amount, "You dont have any tokens");
             _totalSupply = _totalSupply.sub(amount);
              balances[msg.sender] = balances[msg.sender].sub(amount);
            
             uint256 amountDaiSend = orfeed.getExchangeRate("BABA", "USD", "PROVIDER1", 1).mul(amount).div(100);
              
             require(dai.transfer(msg.sender, amountDaiSend));
             
        }
        function burnAllTokens(){
             require(balances[msg.sender] >= amount, "You dont have any tokens");
             uint256 amount = balances[msg.sender];
             _totalSupply = _totalSupply.sub(amount);
              balances[msg.sender] = balances[msg.sender].sub(amount);
            
             uint256 amountDaiSend = orfeed.getExchangeRate("BABA", "USD", "PROVIDER1", 1).mul(amount).div(100);
              
             require(dai.transfer(msg.sender, amountDaiSend));
        }
        
        function buyLong (uint256 multiple) payable returns(bool){
            require(positions[msg.sender][1]== 0, "You already have a position. Use another account");
            uint256 initialAmount = msg.value;
            require(msg.value > 1000000, "Not enough for a trade");
             bytes memory PERM_HINT = "PERM";
             
             uint daiAmount = kyberProxy.tradeWithHint.value(initialAmount)(eth, initialAmount, dai, this, 8000000000000000000000000000000000000000000000000000000000000000, 0, 0x0000000000000000000000000000000000000004, PERM_HINT);
            require(daiAmount > 0, "Not enough money to create a position");
            uint256 assetPrice = orfeed.getExchangeRate("BABA", "USD", "PROVIDER1", 1);
            positions[msg.sender] = [1, daiAmount, multiple, assetPrice];
            return true;
        }
        
        function sellShort(uint256 multiple) payable returns(bool){
            require(positions[msg.sender][1]== 0, "You already have a position. Use another account");
            uint256 initialAmount = msg.value;
            require(msg.value > 1000000, "Not enough for a trade");
             bytes memory PERM_HINT = "PERM";
             
             uint daiAmount = kyberProxy.tradeWithHint.value(initialAmount)(eth, initialAmount, dai, this, 8000000000000000000000000000000000000000000000000000000000000000, 0, 0x0000000000000000000000000000000000000004, PERM_HINT);
            require(daiAmount > 0, "Not enough money to create a position");
            uint256 assetPrice = orfeed.getExchangeRate("BABA", "USD", "PROVIDER1", 1);
            positions[msg.sender] = [0, daiAmount, multiple, assetPrice];
            return true;
        }
        
        function closePosition() returns(bool){
            require(positions[msg.sender][1]!= 0, "You dont have a position. Create one before you close it");
            
            uint256 currentPrice= orfeed.getExchangeRate("BABA", "USD", "PROVIDER1", 1);
            uint256 boughtPrice = positions[msg.sender][3];
            uint256 percentageGain;
            uint amountExtraToSend;
            uint amountToSend;
            uint256 counterAmount;
            
            //for short
            if(positions[msg.sender][0] ==0){
                
                
                //made money
               if(currentPrice <= boughtPrice){
                   
                    amountExtraToSend = getPNL(msg.sender, currentPrice, boughtPrice, positions[msg.sender][0]);
                    amountToSend = positions[msg.sender][1].add(amountExtraToSend);
                    
                   dai.transfer(msg.sender, amountToSend);
                   
                    positions[msg.sender] = [0,0,0,0];
                   return true;
               } 
               //lost money
               else{
                     amountExtraToSend = getPNL(msg.sender, currentPrice, boughtPrice, positions[msg.sender][0]);
                     
                      totalInCollateralizerClaimPool = totalInCollateralizerClaimPool.add(amountExtraToSend);
                       if(positions[msg.sender][1] > amountExtraToSend){
                           
                             amountToSend = positions[msg.sender][1].sub(amountExtraToSend);
                  
                   dai.transfer(msg.sender, amountToSend);
                       }
                       
                       
                      
                   positions[msg.sender] = [0,0,0,0];
                   return true;
               }
            }
            
            //for longs
            else{
                //made money
                if(currentPrice >= boughtPrice){
                     amountExtraToSend = getPNL(msg.sender, currentPrice, boughtPrice, positions[msg.sender][0]);
                    amountToSend = positions[msg.sender][1].add(amountExtraToSend);
               
                   dai.transfer(msg.sender, amountToSend);
                    positions[msg.sender] = [0,0,0,0];
                   return true;
               } 
               //lost money
               else{
                     amountExtraToSend = getPNL(msg.sender, currentPrice, boughtPrice, positions[msg.sender][0]);
                     totalInCollateralizerClaimPool = totalInCollateralizerClaimPool.add(amountExtraToSend);
                     
                    if(positions[msg.sender][1] > amountExtraToSend){
                        amountToSend = positions[msg.sender][1].sub(amountExtraToSend);
                       
                       dai.transfer(msg.sender, amountToSend);
                    }
                    positions[msg.sender] = [0,0,0,0];
                   return true;
               }
            }
            
           
            
        }
        
        
        function getPNL(address userAddress, uint256 currentPrice, uint256 boughtPrice, uint256 side) constant returns(uint256){
            
             uint256 percentageGain;
            uint256 amountExtraToSend;
                
            if(side == 0){
                //mad money
                if(currentPrice <= boughtPrice){
                 percentageGain = boughtPrice.mul(1000000).div(currentPrice.mul(1000));
                amountExtraToSend = positions[userAddress][1].mul(percentageGain).div(1000).mul(positions[userAddress][2]);
                }
                 //lost money
               else{
                   percentageGain = currentPrice.mul(1000000).div(boughtPrice.mul(1000));
                amountExtraToSend = positions[userAddress][1].mul(percentageGain).div(1000).mul(positions[userAddress][2]);
                  
               }
            }
            
            else{
                 //made money
                if(currentPrice >= boughtPrice){
                   percentageGain = currentPrice.mul(1000000).div(boughtPrice.mul(1000));
                    amountExtraToSend = positions[userAddress][1].mul(percentageGain).div(1000).mul(positions[msg.sender][2]);
                }
               //lost money
               else{
                   percentageGain = boughtPrice.mul(1000000).div(currentPrice.mul(1000));
                    amountExtraToSend = positions[userAddress][1].mul(percentageGain).div(1000).mul(positions[msg.sender][2]);
                   
                   
                   
                  
               }
            }
            
            return amountExtraToSend;
        }
        
        function getCollateral(uint256 amount) returns (bool){
            require(canUnCollateralizeWhen[msg.sender] !=0, "You dont have any collateral");
             require(canUnCollateralizeWhen[msg.sender] < block.timestamp, "You need to wait until timestamp is reached. 30 days from adding collateral ");
             
             require(dai.transfer(msg.sender, amount));
             
             daiAsCollateralInitial[msg.sender].sub(amount);
             
        }
        

        function getETH2TokenRate() constant returns(uint256){
            
            uint256 equityRate = orfeed.getExchangeRate("BABA", "USD", "PROVIDER1", 1);
            uint256 dolToEthRate = orfeed.getExchangeRate("DAI", "ETH", "DEFAULT", equityRate);
            uint256 base = 100000000;
            uint256 rate = base.div(dolToEthRate);
            return rate;
        }
        
        
        function endCrowdsale() onlyOwner {
            isMinting = false;
        }
        
        function totalSupply() constant returns(uint256){
            return _totalSupply;
        }
        // What is the balance of a particular account?
        function balanceOf(address _owner) constant returns(uint256){
            return balances[_owner];
        }
        
        function balanceOfPositions(address _owner) constant returns(uint256[4] thePositions){
            return positions[_owner];
        }
        
        function getClaimPoolTotal () constant returns(uint256){
            return totalInCollateralizerClaimPool;
        }

         // Transfer the balance from owner's account to another account   
        function transfer(address _to, uint256 _value)  returns(bool) {
            require(balances[msg.sender] >= _value && _value > 0 );
            balances[msg.sender] = balances[msg.sender].sub(_value);
            balances[_to] = balances[_to].add(_value);
            Transfer(msg.sender, _to, _value);
            return true;
        }
        
    // Send _value amount of tokens from address _from to address _to
    // The transferFrom method is used for a withdraw workflow, allowing contracts to send
    // tokens on your behalf, for example to "deposit" to a contract address and/or to charge
    // fees in sub-currencies; the command should fail unless the _from account has
    // deliberately authorized the sender of the message via some mechanism; we propose
    // these standardized APIs for approval:
    function transferFrom(address _from, address _to, uint256 _value)  returns(bool) {
        require(allowed[_from][msg.sender] >= _value && balances[_from] >= _value && _value > 0);
        balances[_from] = balances[_from].sub(_value);
        balances[_to] = balances[_to].add(_value);
        allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_value);
        Transfer(_from, _to, _value);
        return true;
    }
    
    // Allow _spender to withdraw from your account, multiple times, up to the _value amount.
    // If this function is called again it overwrites the current allowance with _value.
    function approve(address _spender, uint256 _value) returns(bool){
        allowed[msg.sender][_spender] = _value; 
        Approval(msg.sender, _spender, _value);
        return true;
    }
    
    function testingGetDaiBack() onlyOwner{
        uint daiBalance = dai.balanceOf(this);
        dai.transfer(msg.sender, daiBalance);
        
    }
    
    // Returns the amount which _spender is still allowed to withdraw from _owner
    function allowance(address _owner, address _spender) constant returns(uint256){
        return allowed[_owner][_spender];
    }
    
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
    event Error(string message);
}