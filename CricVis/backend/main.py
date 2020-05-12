import json
import os
import sys
import random
import pandas as pd
from flask import Flask
from flask_cors import CORS


app = Flask(__name__)

cors = CORS(app, resources={r'/*': {"origins": "http://localhost:4200"}})

teamsDF = pd.read_csv('./data/teams.csv', index_col=0)
playersDF = pd.read_csv('./data/players.csv', index_col=0)
venueDF = pd.read_csv('./data/venues.csv', index_col=0)

@app.route('/')
def home():
    return json.dumps({'resp' :'All OK'})

@app.route('/getTeams')
def getTeams():
    resultJSON = teamsDF.to_json(orient='records')
    return resultJSON

@app.route('/getPlayers')
def getPlayers():
    resultJSON = playersDF.to_json(orient='records')
    return resultJSON

@app.route('/getVenues')
def getVenues():
    resultJSON = venueDF.to_json(orient='records')
    return resultJSON

@app.route('/test')
def welcome():
    return 'Welcome'

if __name__ == '__main__':
    port = 8081
    app.run(host='0.0.0.0', port=port, debug=True)
