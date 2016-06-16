import sys
import json
from flask import Flask, request, render_template, json, send_from_directory, Response
import pymongo
from pymongo import MongoClient
from bson.son import SON
import numpy as np
from pandas import Series, DataFrame
import pandas as pd


def get_db():
    client = MongoClient('localhost', 27017)
    return client.expedia


def remove_u(source):
    return source.replace("u'", "'")


def stats_searchdate_frame_factory(data):
    avg_comp_arr = []
    avg_price_arr = []
    avg_rank_arr = []
    checkin_date = []
    for item in data:
        avg_comp_arr.append(item['avgComp'])
        avg_price_arr.append(item['avgPrice'])
        avg_rank_arr.append(item['avgRank'])
        checkin_date.append(item['checkinDate'])
    series_avg_comp = pd.Series(avg_comp_arr, index=checkin_date)
    series_avg_price = pd.Series(avg_price_arr, index=checkin_date)
    series_avg_rank = pd.Series(avg_rank_arr, index=checkin_date)
    dict = {'comp' : series_avg_comp, 'price': series_avg_price, 'rank': series_avg_rank}
    return DataFrame(dict)



app = Flask(__name__, static_url_path='')

@app.route("/")
def homepage():
    return render_template('index.html')

@app.route("/map")
def map_view():
    return render_template('map.html')

@app.route("/hotels.json")
def inventory():
    # get the json
    json_data=open('static/data.json').read()
    data = json.loads(json_data)
    return json.dumps(data, separators=(',', ':'))

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

    return remove_u(str({"region": region, "regionId": regionId, "pos": pos, "posId": posId})).replace("'", '"')


@app.route("/stats/hotel/<hotelId>/pos/<tpId>/region/<regionId>/searchDate/<searchDate>")
def stats_searchdate(hotelId, tpId, regionId, searchDate):
    collection = get_db().timeseries2
    search_res = collection.find({ "hotelId": long(hotelId), "tpid": long(tpId), "regionId": long(regionId), "searchDate": searchDate }).sort("checkinDate", pymongo.ASCENDING)
    data = list(search_res)
    df = stats_searchdate_frame_factory(data)

    result = {
        'data': df.to_json(),
        'max': df.max().to_json(),
        'min': df.min().to_json(),
        'avg': df.mean().to_json(),
        'std': df.std().to_json(),
        'searchDate': searchDate
    }

    return remove_u(str(result)).replace("'", '"')


if __name__ == "__main__":
    app.run(debug=True)