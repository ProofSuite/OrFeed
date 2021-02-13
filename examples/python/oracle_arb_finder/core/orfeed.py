from web3 import Web3
from core.smartcontracts import my_smartcontracts

class Orfeed:
    def __init__(self, web3):
        self.orfeed_address = Web3.toChecksumAddress(my_smartcontracts["orfeed"]["address"])
        self.w3 = web3
        self.orfeed_contract = self.w3.eth.contract(address=self.orfeed_address, abi=my_smartcontracts["orfeed"]["abi"])

    def getExchangeRate(self, _from, _to, _provider, _amount):
        if _from == _to or _amount <= 0:
            return -1
        try:
            return self.orfeed_contract.functions.getExchangeRate(_from, _to, _provider, _amount).call()
        except Exception:
            return -1

    def getTokenAddress(self, symbol):
        try:
            return self.orfeed_contract.functions.getTokenAddress(symbol).call()
        except Exception:
            return -1

    def getTokenDecimalCount(self, address):
        return self.orfeed_contract.functions.getTokenDecimalCount(address).call()
