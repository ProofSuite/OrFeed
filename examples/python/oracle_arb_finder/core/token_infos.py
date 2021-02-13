token_symbols = {
    "DAI": {
        'address' : 0x6b175474e89094c44da98b954eedeac495271d0f,
        'decimals' : 18
    },
    "USDC": {
        'address' : 0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48,
        'decimals' : 6
    },
    "MKR" : {
        'address' : 0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2,
        'decimals' : 18
    },
    "LINK" : {
        'address' : 0x514910771af9ca656af840dff83e8264ecf986ca,
        'decimals' : 18
    },
    "BAT" : {
        'address' : 0x0d8775f648430679a709e98d2b0cb6250d2887ef,
        'decimals' : 18
    },
    "WBTC" : {
        'address' : 0x2260fac5e5542a773aa44fbcfedf7c193bc2c599,
        'decimals' : 8
    },
    "USDT" : {
        'address' : 0xdac17f958d2ee523a2206206994597c13d831ec7,
        'decimals' : 6
    },
    "OMG" : {
        'address' : 0xd26114cd6EE289AccF82350c8d8487fedB8A0C07,
        'decimals' : 18
    },
    "ZRX" : {
        'address' : 0xe41d2489571d322189246dafa5ebde1f4699f498,
        'decimals' : 18
    },
    "TUSD" : {
        'decimals': 18
    },
    "LEND" : {
        'address' : 0x80fB784B7eD66730e8b1DBd9820aFD29931aab03,
        'decimals' : 18
    },
    "REP" : {
        'address' : 0x221657776846890989a759ba2973e427dff5c9bb,
        'decimals' : 18
    },
    "BNT" : {
        'address' : 0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c,
        'decimals' : 18
    },
    "PAX" : {
        'address' : 0x8e870d67f660d95d5be530380d0ec0bd388289e1,
        'decimals' : 18
    },
    "SUSD" : {
        'address' : 0x57ab1ec28d129707052df4df418d58a2d46d5f51,
        'decimals' : 18
    },
    "KNC" : {
        'address' : 0xdd974d5c2e2928dea5f71b9825b8b646686bd200,
        'decimals' : 18
    },
    "ETH" : {
    # 'address' : 0xdd974d5c2e2928dea5f71b9825b8b646686bd200,
    'decimals' : 18
    }
    }

orfeed_list_providers = ["UNISWAPBYSYMBOLV1", "UNISWAPBYSYMBOLV2", "KYBERBYSYMBOLV1"]

def init_dict_token_dex():
    token_dex = {}
    for token in token_symbols:
        token_dex[token] = {}
        for provider in orfeed_list_providers:
            token_dex[token][provider] = 0
    return token_dex
