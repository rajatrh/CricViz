import json
import os
import sys
import random
import pandas as pd
from flask import Flask
from flask_cors import CORS
from flask import request
from flask import jsonify


app = Flask(__name__)

cors = CORS(app)

teamsDF = pd.read_csv('./data/top_teams.csv', index_col=0)
playersDF = pd.read_csv('./data/top_players.csv', index_col=0)
venueDF = pd.read_csv('./data/top_venues.csv', index_col=0)
batsmanDF = pd.read_csv('./data/top_batsman.csv', index_col=0)
scorecardDF = pd.read_csv('./data/top_batsman_score.csv', index_col=0)
mergedDF = pd.read_csv('./data/merged_data_final.csv', index_col=0)

@app.route('/')
def home():
    return json.dumps({'resp' :'All OK'})

@app.route('/setupData')
def setup():
    return json.dumps({'teams' : json.loads(teamsDF.to_json(orient='records')),
    'batsmen' : json.loads(batsmanDF.to_json(orient='records')),
    'players' : json.loads(playersDF.to_json(orient='records')),
    'venues' : json.loads(venueDF.to_json(orient='records'))})

@app.route('/fetchPlayerScorecard')
def fetchPlayerInfo():
    pId = request.args.get('id')
    ret = mergedDF[mergedDF['playerId'] == float(pId)]
    resultJSON = ret.to_json(orient='records')
    return resultJSON


if __name__ == '__main__':
    port = 8081
    app.run(host='0.0.0.0', port=port, debug=True)
