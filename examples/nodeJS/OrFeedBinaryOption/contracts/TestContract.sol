pragma solidity ^0.4.24;

contract TestContract {
    struct Option {
        address owner;
        uint256 expiryTime;
        uint256 strikePrice;
        uint256 amount;
        uint8 direction;
        bool settled;
    }

    uint256 public price = 10;
    event moneySent(address);

    Option[] public array;

    function getExchangeRate(
        string _symbol1,
        string _symbol2,
        string venue,
        uint256 amount
    ) view returns (uint256) {
        return price;
    }

    function setStrikePrice(uint256 value) public {
        price = value;
    }

    // direction : 1 = long, 0 = short
    function createOption(uint8 _direction) public payable {
        uint256 strikePrice = getExchangeRate("BTC", "USDC", "DEFAULT", 10000);
        require(strikePrice > 0, "Error in getting strike price from oracle");
        require(msg.value > 0, "Non zero amount must be sent");
        array.push(
            Option(
                msg.sender,
                now + 1 minutes,
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
                uint256 currentPrice = getExchangeRate(
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
                    emit moneySent(option.owner);
                    option.owner.transfer(option.amount * 2);
                }
                array[j].settled = true;
                j++;
                break;
            }
        }
    }

}
