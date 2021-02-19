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


def getTokenToTokenPrice(orfeed_i, tokenSrc, tokenDst, dex, amount_src_token=1):
    """Get the rate of swap tokenSrc to tokenDst in a given Dex

    Args:
        orfeed_i (OrFeed): The instance of OrFeed class
        tokenSrc (Symbol): Symbol of src token
        tokenDst (Symbol): Symbol of dst token
        dex (str): The Dex where the rate is going to be requested
        amount_src_token (int, optional): Amount of src token. Defaults to 1 src token unit.

    Returns:
        Dict: Return a dict containing all relevant infos about the request
    """
    res = orfeed_i.getExchangeRate(tokenSrc, tokenDst, dex, amount_src_token)

    return {
        "tokenSrc": tokenSrc,
        "tokenDst": tokenDst,
        "tokenPair": tokenSrc + "-" + tokenDst,
        "provider": dex,
        "price": res,
    }


def simple_getTokenToTokenPrice(
    orfeed_i, src_token, src_token_infos, dst_token, dst_token_infos
):
    """For a pair of token, retrieve prices between Uniswap Dex and Kyber Dex.

    Args:
        orfeed_i (OrFeed): Instance of OrFeed
        src_token (Symbol): : Symbol of src token
        src_token_infos (Dict): Dict containing src token infos (number of decimals and address)
        dst_token (Symbol): Symbol of dst_token
        dst_token_infos (Symbol): Dict containing dst token infos (number of decimals and address)

    Returns:
        Dict: Dict containing all infos about buy/sell.
    """
    result = {}
    providers_list = ["UNISWAPBYSYMBOLV2", "KYBERBYSYMBOLV1"]
    tmp_res = {}
    for provider in providers_list:
        buy = getTokenToTokenPrice(
            orfeed_i,
            src_token,
            dst_token,
            provider,
            amount_src_token=10 ** src_token_infos["decimals"],
        )
        sell = getTokenToTokenPrice(
            orfeed_i, dst_token, src_token, provider, amount_src_token=buy["price"]
        )
        tmp_res[provider] = {
            "buy_price_wei": buy["price"] / (10 ** dst_token_infos["decimals"]),
            "sell_price_wei": sell["price"]
            * buy["price"]
            / (10 ** (dst_token_infos["decimals"] + src_token_infos["decimals"])),
        }
        if buy["price"] > 0 and sell["price"] > 0:
            tmp_res[provider] = {
                "buy_price_wei": buy["price"] / (10 ** dst_token_infos["decimals"]),
                "sell_price_wei": sell["price"]
                * buy["price"]
                / (10 ** (dst_token_infos["decimals"] + src_token_infos["decimals"])),
            }
        else:
            return None
        result[provider] = tmp_res[provider]
    return result
