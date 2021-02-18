pragma solidity ^0.4.24;

interface OrFeedInterface {
    function getExchangeRate(
        string fromSymbol,
        string toSymbol,
        string venue,
        uint256 amount
    ) external view returns (uint256);
    function getTokenDecimalCount(address tokenAddress)
        external
        view
        returns (uint256);
    function getTokenAddress(string symbol) external view returns (address);
    function getSynthBytes32(string symbol) external view returns (bytes32);
    function getForexAddress(string symbol) external view returns (address);
}

contract BinaryOptions {
    struct Option {
        address owner;
        uint256 expiryTime;
        uint256 strikePrice;
        uint256 amount;
        uint8 direction;
        bool settled;
    }

    OrFeedInterface orfeed;
    Option[] array;
    constructor() public {
        orfeed = OrFeedInterface(0x8316B082621CFedAB95bf4a44a1d4B64a6ffc336);
    }
    // direction : 1 = long, 0 = short
    function createOption(uint8 _direction) public payable {
        uint256 strikePrice = orfeed.getExchangeRate(
            "BTC",
            "USDC",
            "DEFAULT",
            10000
        );
        require(msg.value > 0, "Non zero amount must be sent");
        array.push(
            Option(
                msg.sender,
                now + 5 minutes,
                strikePrice,
                msg.value,
                _direction,
                false
            )
        );
        settleOptions();
    }

    function settleOptions() public {
        uint256 j = 0;
        for (uint256 i = 0; i < 5; i++) {
            while (j < array.length) {
                Option storage option = array[j];
                if (option.expiryTime > now || option.settled) {
                    j++;
                    continue;
                }
                uint256 currentPrice = orfeed.getExchangeRate(
                    "BTC",
                    "USDC",
                    "DEFAULT",
                    10000
                );
                if (
                    (option.direction == 1 &&
                        currentPrice > option.strikePrice) ||
                    (option.direction == 0 && currentPrice < option.strikePrice)
                ) {
                    option.owner.transfer(option.amount * 2);
                }
                array[j].settled = true;
                j++;
                break;
            }
        }
    }

}
