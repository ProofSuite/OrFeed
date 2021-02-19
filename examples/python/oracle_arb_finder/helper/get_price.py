from threading import Thread
import os, time, pprint
from web3 import Web3, eth
from tqdm import tqdm
from core.functions import simple_getTokenToTokenPrice
from core.orfeed import Orfeed
from core.token_infos import token_symbols

w3 = Web3(Web3.HTTPProvider(os.getenv("BLOCKCHAIN_PROVIDER")))
# w3 = Web3(Web3.HTTPProvider('http://127.0.0.1:8545')) # uncomment if you use ganache-cli
orfeed_i = Orfeed(w3)


class ThreadWithReturnValue(Thread):
    def __init__(
        self, group=None, target=None, name=None, args=(), kwargs={}, Verbose=None
    ):
        Thread.__init__(self, group, target, name, args, kwargs)
        self._return = None

    def run(self):
        # print(type(self._target))
        if self._target is not None:
            self._return = self._target(*self._args, **self._kwargs)

    def join(self, *args):
        Thread.join(self, *args)
        return self._return


def get_raw_price_async():
    list_thread = {}
    for src_token in token_symbols:
        for dst_token in token_symbols:
            if src_token != dst_token:
                list_thread[src_token + "/" + dst_token] = ThreadWithReturnValue(
                    target=simple_getTokenToTokenPrice,
                    args=(
                        orfeed_i,
                        src_token,
                        token_symbols[src_token],
                        dst_token,
                        token_symbols[dst_token],
                    ),
                )
                list_thread[src_token + "/" + dst_token].start()

    # res = [{i: list_thread[i].join()} for i in list_thread if list_thread[i].join() != -1]
    res = {}
    for i in list_thread:
        res[i] = list_thread[i].join()
    return res


def get_clean_price(list_raw_price, coeff=2000):
    result = {}
    dex_list = ["UNISWAPBYSYMBOLV2", "KYBERBYSYMBOLV1"]
    for pair in list_raw_price:
        if list_raw_price[pair] is None:
            continue

        buy_price_ratio = (
            list_raw_price[pair][dex_list[0]]["buy_price_wei"]
            / list_raw_price[pair][dex_list[1]]["buy_price_wei"]
        )
        sell_price_ratio = (
            list_raw_price[pair][dex_list[0]]["sell_price_wei"]
            / list_raw_price[pair][dex_list[1]]["sell_price_wei"]
        )
        if (buy_price_ratio > coeff or 1 / buy_price_ratio > coeff) or (
            sell_price_ratio > coeff or 1 / sell_price_ratio > coeff
        ):
            continue

        for dex in dex_list:
            if (
                list_raw_price[pair][dex]["buy_price_wei"] > 0
                and list_raw_price[pair][dex]["sell_price_wei"] > 0
            ):
                result[pair] = list_raw_price[pair]
    return result


def compute_arb_opportunities(list_clean_price):
    dex_list = ["UNISWAPBYSYMBOLV2", "KYBERBYSYMBOLV1"]
    for pair in list_clean_price:
        path = {
            "one": (
                list_clean_price[pair][dex_list[1]]["sell_price_wei"]
                - list_clean_price[pair][dex_list[0]]["buy_price_wei"]
            )
            / list_clean_price[pair][dex_list[0]]["buy_price_wei"],
            "two": (
                list_clean_price[pair][dex_list[0]]["sell_price_wei"]
                - list_clean_price[pair][dex_list[1]]["buy_price_wei"]
            )
            / list_clean_price[pair][dex_list[1]]["buy_price_wei"],
        }
        if path["one"] > path["two"] and path["one"] > 0:
            list_clean_price[pair]["%"] = path["one"]
            list_clean_price[pair]["code"] = 1
        elif path["two"] > path["one"] and path["two"] > 0:
            list_clean_price[pair]["%"] = path["two"]
            list_clean_price[pair]["code"] = 2

    return {
        k: v
        for k, v in list_clean_price.items()
        if list_clean_price[k].get("%") is not None
    }


def get_output(list_arb_price):
    hint_msg = "swap {amount_src_token} {src_token} for {amount_dst_token} {dst_token} in {dex}"
    [dex_1, dex_2] = ["UNISWAPBYSYMBOLV2", "KYBERBYSYMBOLV1"]
    for pair in list_arb_price:
        [src_token, dst_token] = pair.split("/")
        if list_arb_price[pair]["code"] == 1:
            amount_src_token = list_arb_price[pair][dex_1]["buy_price_wei"]
            amount_dst_token = list_arb_price[pair][dex_2]["sell_price_wei"]
            dict_var_msg_1 = {
                "src_token": src_token,
                "dst_token": dst_token,
                "amount_src_token": 1,
                "amount_dst_token": amount_src_token,
                "dex": dex_1,
            }
            dict_var_msg_2 = {
                "src_token": dst_token,
                "dst_token": src_token,
                "amount_src_token": amount_dst_token,
                "amount_dst_token": 1,
                "dex": dex_2,
            }
            list_arb_price[pair]["swap_1"] = hint_msg.format(**dict_var_msg_1)
            list_arb_price[pair]["swap_2"] = hint_msg.format(**dict_var_msg_2)
        else:
            amount_src_token = list_arb_price[pair][dex_2]["buy_price_wei"]
            amount_dst_token = list_arb_price[pair][dex_1]["sell_price_wei"]
            dict_var_msg_1 = {
                "src_token": dst_token,
                "dst_token": src_token,
                "amount_src_token": amount_src_token,
                "amount_dst_token": 1,
                "dex": dex_1,
            }
            dict_var_msg_2 = {
                "src_token": src_token,
                "dst_token": dst_token,
                "amount_src_token": 1,
                "amount_dst_token": amount_dst_token,
                "dex": dex_2,
            }
            list_arb_price[pair]["swap_1"] = hint_msg.format(**dict_var_msg_2)
            list_arb_price[pair]["swap_2"] = hint_msg.format(**dict_var_msg_1)

    return list_arb_price
