import json
import os
import sys
import random

from flask import Flask, jsonify
from flask_cors import CORS
from flask import flash, redirect, render_template, request, session, abort

import numpy as np
import pandas as pd
import matplotlib as plt
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from sklearn.manifold import MDS
from scipy.spatial.distance import cdist

app = Flask(__name__)
CORS(app)


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/test')
def welcome():
    return 'Welcome'

if __name__ == '__main__':
    port = 8081
    app.run(host='0.0.0.0', port=port, debug=True)
