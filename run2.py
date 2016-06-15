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


@app.route("/series/hotel/<hotelId>/pos/<tpId>/region/<regionId>/searchDate/<searchDate>")
def series(hotelId, tpId, regionId, searchDate):
    collection = get_db().timeseries2
    q = {"searchDate": searchDate, "hotelId": long(hotelId), "tpid": long(tpId), "regionId": long(regionId)}
    return remove_u(str(list(collection.find(q, {"_id": 0, "tpid": 0, "regionId": 0, "hotelId": 0, "searchDate": 0})))).replace("'", '"')


@app.route("/names/pos/<posId>/region/<regionId>")
def pos_region(posId, regionId):
    collection = get_db().tpos
    obj = collection.find_one({"tposid": long(posId)})
    pos = remove_u(str(obj["name"])).replace("'", '"')

    collection = get_db().regions
    obj = collection.find_one({"RegionId": long(regionId)})
    region = remove_u(str(obj["RegionNameLong"])).replace("'", '"')

    return remove_u(str({"region": region, "pos": pos})).replace("'", '"')


if __name__ == "__main__":
    app.run()