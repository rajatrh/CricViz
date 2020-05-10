import json
import os
import sys
import random
from flask import Flask
from flask_cors import CORS


app = Flask(__name__)

cors = CORS(app, resources={r"/*": {"origins": "*"}})


@app.route('/')
def home():
    return json.dumps({'resp' :'All OK'})


@app.route('/test')
def welcome():
    return 'Welcome'

if __name__ == '__main__':
    port = 8081
    app.run(host='0.0.0.0', port=port, debug=True)
