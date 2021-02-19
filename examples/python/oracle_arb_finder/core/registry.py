import web3
from web3 import Web3
from smartcontracts import my_smartcontracts


class Registry:
    def __init__(self, web3):
        self.registry_address = Web3.toChecksumAddress(
            my_smartcontracts["registry"]["address"]
        )
        self.w3 = web3
        self.registry_contract = self.w3.eth.contract(
            address=self.registry_address, abi=my_smartcontracts["registry"]["abi"]
        )

    def getAllOracles(self):
        res = self.registry_contract.functions.getAllOracles().call()
        return res

    def getOracleInfo(self, name_reference=None):
        res = self.registry_contract.functions.getOracleInfo(name_reference).call()
        return res
