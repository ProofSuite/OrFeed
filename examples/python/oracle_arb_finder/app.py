from lib.get_price import (
    get_raw_price_async,
    get_clean_price,
    compute_arb_opportunities,
    get_output,
)
from pprint import pprint


def get_list_arb():
    """Run the arb finder

    Returns:
        List: List sorted by % of all arb opportunities found.
    """
    dict_price_raw = get_raw_price_async()
    dict_clean_price = get_clean_price(dict_price_raw)
    list_arb_price = compute_arb_opportunities(dict_clean_price)
    res = get_output(list_arb_price)
    sorted_list_arb = sorted(res.items(), key=lambda i: i[1]["%"], reverse=True)
    pprint(sorted_list_arb)
    return sorted_list_arb


if __name__ == "__main__":
    get_list_arb()
