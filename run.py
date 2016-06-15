import sys
import json
from flask import Flask
from pymongo import MongoClient
from bson.son import SON

app = Flask(__name__)

@app.route("/")
def hello():
    client = MongoClient('localhost', 27017)
    db = client.expedia
    collection = db.timeseries
    query = [ { "$match" : { "metric" : "avgPrice" } }, { "$group": { "_id": "$tpid", "stdevAvgPrice": { "$stdDevSamp": "$value" } } } ]
    return str(list(collection.aggregate(query)))

if __name__ == "__main__":
    app.run()