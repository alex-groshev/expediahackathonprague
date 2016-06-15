import sys
import json
from flask import Flask, request, render_template, json , send_from_directory
from pymongo import MongoClient
from bson.son import SON


def get_db():
    client = MongoClient('localhost', 27017)
    return client.expedia


def remove_u(source):
    return source.replace("u'", "'")


app = Flask(__name__, static_url_path='')

@app.route("/")
def homepage():
    return render_template('index.html')
    #return app.send_static_file('index.html')

    # collection = get_db().timeseries
    # query = [
    #     { "$match" : { "metric" : "avgPrice" } },
    #     { "$group": { "_id": "$tpid", "stdevAvgPrice": { "$stdDevSamp": "$value" } } }
    # ]
    # return str(list(collection.aggregate(query)))


@app.route("/series/hotel/<hotelId>/pos/<tpId>/region/<regionId>")
def series(hotelId, tpId, regionId):
    collection = get_db().timeseries

    query = [
        { "$match" : { "tpid": long(tpId), "regionId": long(regionId), "hotelId": long(hotelId)} },
        { "$group" : { "_id": "$searchDate", "metrics": { "$push": "$metric" }, "values": { "$push": "$value" } } },
        { "$project" : { "searchDate": "$_id", "metrics": 1, "values": 1, "_id": 0 } },
        { "$sort" : { "searchDate": 1 } }
    ]

    return remove_u(str(list(collection.aggregate(query))))


if __name__ == "__main__":
    app.run()