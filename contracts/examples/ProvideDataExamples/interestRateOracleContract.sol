
library SafeMath {
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }
        uint256 c = a * b;
        assert(c / a == b);
        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        // assert(b > 0); // Solidity automatically throws when dividing by 0
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold
        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b <= a);
        return a - b;
    }

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        assert(c >= a);
        return c;
    }
}

interface ERC20Detailed {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function symbol() public view returns (string memory);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

// Compound
interface Compound {
    function supply(address asset, uint amount) external returns (uint);
    function withdraw(address asset, uint requestedAmount) external returns (uint);
    function getSupplyBalance(address account, address asset) external view returns (uint);
    function borrowRatePerBlock() external view returns (uint);
    function supplyRatePerBlock() external view returns (uint);
    function mint(uint mintAmount) external returns (uint);
    function redeem(uint redeemTokens) external returns (uint);
    function balanceOf(address account) external view returns (uint);
}

// Fulcrum
interface Fulcrum {
    function borrowInterestRate() external view returns (uint256);
    function supplyInterestRate() external view returns (uint256);
}

interface DyDx {
    struct val {
        uint256 value;
    }

    struct set {
        uint128 borrow;
        uint128 supply;
    }

    function getEarningsRate() external view returns (val memory);
    function getMarketInterestRate(uint256 marketId) external view returns (val memory);
    function getMarketTotalPar(uint256 marketId) external view returns (set memory);
}

interface LendingPoolAddressesProvider {
    function getLendingPoolCore() external view returns (address);
}

interface LendingPoolCore  {
    function getReserveCurrentLiquidityRate(address _reserve)
    external
    view
    returns (
        uint256 liquidityRate
    );
    function getReserveCurrentVariableBorrowRate(address _reserve) external view returns (uint256);
}

interface OrFeedInterface {
    function getExchangeRate (string fromSymbol, string toSymbol, string venue, uint256 amount) external view returns (uint256);
    function getTokenDecimalCount (address tokenAddress) external view returns (uint256);
    function getTokenAddress (string symbol) external view returns (address);
    function getSynthBytes32 (string symbol) external view returns (bytes32);
    function getForexAddress (string symbol) external view returns (address);
}

contract InterestRateOracleContract {
    struct PlatformSide {
        string platform;
        bool isBorrow;
    }

    OrFeed orfeed = OrFeedInterface(0x8316b082621cfedab95bf4a44a1d4b64a6ffc336);
    DyDx dYdX = DyDx(0x1E0447b19BB6EcFdAe1e4AE1694b0C3659614e4e);
    LendingPoolCore aave = LendingPoolCore(LendingPoolAddressesProvider(0x24a42fD28C976A61Df5D00D0599C34c4f90748c8).getLendingPoolCore());

    uint256 constant ASCII_HYPHEN = 45;
    uint256 constant ASCII_ZERO = 48;
    uint256 constant ASCII_UPPERCASE_X = 88;
    uint256 constant ASCII_LOWERCASE_X = 120;
    uint256 constant DECIMAL = 10 ** 18;

    constructor() public payable {
        owner = msg.sender;
    }

    function getInterestRate(string fromParam, string, string venue, uint256 amount) public returns (uint256) {
        string memory tokenSymbol = getTokenSymbol(fromParam);
        PlatformSide memory platformSide = getPlatformSide(venue);
        uint256 memory interestRate = getInterestRate(tokenSymbol, platformSide);

        return amount.mul(interestRate).div(DECIMAL);
    }

    function getTokenSymbol(string input) internal returns (string memory) {
        bytes memory b = bytes(input);

        if (b.length < 3) {
            return input;
        } else if (b[0] == ASCII_ZERO && (b[1] == ASCII_UPPERCASE_X || b[1] == ASCII_LOWERCASE_X)) {
            return ERC20Detailed(address(input)).symbol();
        } else {
            return input;
        }
    }

    function getPlatformSide(string input) internal returns (PlatformSide memory) {
        bytes memory b = bytes(input);
        bytes memory platform;
        bytes memory side;
        bool afterHyphen = false;

        for (uint i = 0; i < b.length; i++) {
            if (b[i] == ASCII_HYPHEN) {
                require(platform.length > 0, "Invalid platform string input");
                afterHyphen = true;
                continue;
            }

            if (afterHyphen) {
                side.push(b[i]);
            } else {
                platform.push(b[i]);
            }
        }

        require(side.length > 0, "Invalid side string input");
        return PlatformSide(string(platform), side == 'borrow');
    }

    function getInterestRate(string symbol, PlatformSide platformSide) internal returns (uint256 memory) {
        if (platformSide.platform == 'Compound') {
            string memory platformToken;
            if (symbol == 'BTC') {
                platformToken = 'CWBTC';
            } else {
                platformToken = abi.encodePacked('C', symbol);
            }

            Compound memory cToken = Compound(orfeed.getTokenAddress(platformToken));

            if (platformSide.isBorrow) {
                return cToken.borrowRatePerBlock().mul(cToken.interestRateModel.blocksPerYear);
            } else {
                return cToken.supplyRatePerBlock().mul(cToken.interestRateModel.blocksPerYear);
            }
        } else if (platformSide.platform == 'Fulcrum') {
            string memory platformToken;
            if (symbol == 'BTC') {
                platformToken = 'IWBTC';
            } else {
                platformToken = abi.encodePacked('I', symbol);
            }

            Fulcrum memory iToken = Fulcrum(orfeed.getTokenAddress(platformToken));

            if (platformSide.isBorrow) {
                return iToken.borrowInterestRate().div(100);
            } else {
                return iToken.supplyInterestRate().div(100);
            }
        } else if (platformSide.platform == 'dYdX') {
            uint memory marketId;
            if (symbol == 'ETH') {
                marketId = 0;
            } else if (symbol == 'DAI') {
                marketId = 1;
            } else if (symbol == 'USDC') {
                marketId = 2;
            } else {
                require(false, abi.encodePacked('dYdX does not have market data for ', symbol));
            }

            uint256 rate = dYdX.getMarketInterestRate(marketId).value;
            uint256 aprBorrow = rate * 31622400;

            if (platformSide.isBorrow) {
                return aprBorrow;
            }

            uint256 borrow = dYdX.getMarketTotalPar(marketId).borrow;
            uint256 supply = dYdX.getMarketTotalPar(marketId).supply;
            uint256 usage = (borrow * DECIMAL) / supply;
            return (((aprBorrow * usage) / DECIMAL) * dYdX.getEarningsRate().value) / DECIMAL;
        } else if (platformSide.platform == 'Aave') {
            string memory platformToken;
            if (symbol == 'BTC') {
                platformToken = 'AWBTC';
            } else {
                platformToken = abi.encodePacked('A', symbol);
            }

            if (platformSide.isBorrow) {
                return aave.getReserveCurrentVariableBorrowRate(platformToken).div(1e9);
            }
            return aave.getReserveCurrentLiquidityRate(platformToken).div(1e9);
        } else {
            require(false, 'Platform not supported');
        }
    }
}