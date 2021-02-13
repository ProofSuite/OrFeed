import os
import time
import pprint
from core.token_infos import init_dict_token_dex
from core.orfeed import Orfeed
from dotenv import load_dotenv
load_dotenv()
import web3
from web3 import Web3
from tqdm import tqdm

def getTokenToTokenPrice(orfeed_i, tokenSrc, tokenDst, provider, amount_wei=1):
    res = orfeed_i.getExchangeRate(tokenSrc, tokenDst, provider, amount_wei)

    return {
        "tokenSrc" : tokenSrc,
        "tokenDst" : tokenDst,
        "tokenPair" : tokenSrc + '-' + tokenDst,
        "provider" : provider,
        "price" : res
    }

def simple_getTokenToTokenPrice(orfeed_i, src_token, src_token_infos, dst_token, dst_token_infos):
    result = {}
    providers_list = ["UNISWAPBYSYMBOLV2", "KYBERBYSYMBOLV1"]
    tmp_res = {}
    for provider in providers_list:
        buy = getTokenToTokenPrice(orfeed_i, src_token, dst_token, provider, amount_wei=10**src_token_infos['decimals'])
        sell = getTokenToTokenPrice(orfeed_i, dst_token, src_token, provider, amount_wei=buy["price"])
        tmp_res[provider] = {
            "buy_price_wei": buy["price"]/(10**dst_token_infos['decimals']),
            "sell_price_wei": sell["price"]*buy["price"]/(10**(dst_token_infos['decimals'] + src_token_infos['decimals']))
        }
        if buy["price"] > 0 and sell["price"] > 0:
            tmp_res[provider] = {
                "buy_price_wei": buy["price"]/(10**dst_token_infos['decimals']),
                "sell_price_wei": sell["price"]*buy["price"]/(10**(dst_token_infos['decimals'] + src_token_infos['decimals']))
            }
        else:
            return None
        result[provider] = tmp_res[provider]
    return result
