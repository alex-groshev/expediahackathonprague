import sys
from pymongo import MongoClient


def main():
    client = MongoClient('localhost', 27017)
    db = client.expedia
    collection = db.regions

    n = 1
    with open('ParentRegionList.txt', 'rb') as csvfile:
        for line in csvfile:
            if n == 1:
                n += 1
                continue
            values = line.decode('utf-8-sig').encode('utf-8').strip().split('|')
            doc = {
                'RegionId': long(values[0]),
                'RegionType': values[1],
                'RelativeSignificance': values[2],
                'SubClass': values[3],
                'RegionName': values[4],
                'RegionNameLong': values[5],
                'ParentRegionID': long(values[6]) if not values[6] else "",
                'ParentRegionType': values[7],
                'ParentRegionName': values[8],
                'ParentRegionNameLong': values[9]
            }
            try:
                print 'Inserting region %d' % doc['RegionId']
                collection.insert(doc)
            except:
                print 'Unexpected error:', sys.exc_info()[0], sys.exc_info()[1]
                print line
                return
    print 'Done'


if __name__ == '__main__':
    main()