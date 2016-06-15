import sys
import json
from flask import Flask
from flask import json
from pymongo import MongoClient
from bson.son import SON


def get_db():
    client = MongoClient('localhost', 27017)
    return client.expedia


def remove_u(source):
    return source.replace("u'", "'")


app = Flask(__name__)

@app.route("/")
def hello():
    collection = get_db().timeseries
    query = [
        { "$match" : { "metric" : "avgPrice" } },
        { "$group": { "_id": "$tpid", "stdevAvgPrice": { "$stdDevSamp": "$value" } } }
    ]
    return str(list(collection.aggregate(query)))

#return json.jsonify(list(collection.find({"$and": [ {"tpid":1}, {"metric": "avgPrice"}, {"hotelId": 15240008} ]}, {"_id":0, "searchDate":1, "value":1})))

@app.route("/series/hotel/<hotelId>/pos/<tpId>/region/<regionId>")
def series(hotelId, tpId, regionId):
    collection = get_db().timeseries
    #return str(list(collection.find({"$and": [ {"tpid": long(tpId)}, {"regionId": long(regionId)}, {"hotelId": long(hotelId)} ]}, {"_id":0, "searchDate":1, "metric":1 , "value":1})))
    # xxx = str(list(collection.find({"$and": [ {"tpid": long(tpId)}, {"regionId": long(regionId)}, {"hotelId": long(hotelId)} ]}, {"_id":0, "searchDate":1, "metric":1 , "value":1})))
    # return remove_u(xxx)

    records = list(collection.find({"$and": [ {"tpid": long(tpId)}, {"regionId": long(regionId)}, {"hotelId": long(hotelId)} ]}, {"_id":0, "searchDate":1, "metric":1 , "value":1}))
    result = []
    for record in records:




if __name__ == "__main__":
    app.run()