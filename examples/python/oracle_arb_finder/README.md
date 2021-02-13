# Oracle OrFeed

Oracle OrFeed is a Python program which retrieves the prices of the tokens provided by the oracle OrFeed, and try to find arb opportunities.

## Environnement
You have to rename `.env-example` to `.env`.  Then insert your BLOCKCHAIN_PROVIDER in `.env` file. This can be
NB : Leave the variable network as is.
```
BLOCKCHAIN_PROVIDER=
NETWORK=mainnet
```

## Installation

Create a virtual environment and nstall the package listed in requirements.txt

```bash
python3 -m venv venv
source venv/bin/activate
pip3 install -r requirements.txt
```

## Usage

```python
python3 app.py
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)