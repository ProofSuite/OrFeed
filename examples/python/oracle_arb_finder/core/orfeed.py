from web3 import Web3
from core.smartcontracts import my_smartcontracts


class Orfeed:
    """OrFeed class
    Initialise the blockchain provider
    Implement some methods in order to call method in OrFeed smartcontract
    https://etherscan.io/address/0x8316b082621cfedab95bf4a44a1d4b64a6ffc336
    """
    def __init__(self, web3):
        """Initialize the blockchain provider

        Args:
            web3 (string): url of blockchain provider, can be Infura or AlchemyAPI
        """
        self.orfeed_address = Web3.toChecksumAddress(
            my_smartcontracts["orfeed"]["address"]
        )
        self.w3 = web3
        self.orfeed_contract = self.w3.eth.contract(
            address=self.orfeed_address, abi=my_smartcontracts["orfeed"]["abi"]
        )

    def getExchangeRate(self, _from, _to, _provider, _amount):
        """getExchange rate between two ERC20 tokens on a given DEX

        Args:
            _from (str): symbol of ERC20 token. Source token.
            _to (str): symbol of ERC20 token. Destination token.
            _provider (str): the Dex where you want to swap your tokens.
            _amount (str): amount of source token you want to exchange.

        Returns:
            str: The amount of destination you get.
        """
        if _from == _to or _amount <= 0:
            return -1
        try:
            return self.orfeed_contract.functions.getExchangeRate(
                _from, _to, _provider, _amount
            ).call()
        except Exception:
            return -1

    def getTokenAddress(self, symbol):
        """Return address of a ERC20 token.

        Args:
            symbol (str): ERC20 token.

        Returns:
            str: address of ERC20 token in the blockchain.
        """
        try:
            return self.orfeed_contract.functions.getTokenAddress(symbol).call()
        except Exception:
            return -1

    def getTokenDecimalCount(self, address):
        """Retrieve number of decimals of an ERC20 token.

        Args:
            address (str): address of ERC20 token.

        Returns:
            str: Number of decimals of the ERC20 token given in arg.
        """
        return self.orfeed_contract.functions.getTokenDecimalCount(address).call()
