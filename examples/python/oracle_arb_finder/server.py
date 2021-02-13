from flask import Flask
from app import get_list_arb

app = Flask(__name__)

@app.route('/arb')
def arb():
    return {"result": get_list_arb()}, 200


if __name__=='__main__':
    app.run(debug=True)
