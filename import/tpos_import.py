import sys
from pymongo import MongoClient


def main():
    client = MongoClient('localhost', 27017)
    db = client.expedia
    collection = db.tpos

    with open('pointofsale.txt', 'rb') as csvfile:
        for line in csvfile:
            #values = line.decode('utf-8-sig').encode('utf-8').strip().split('|')
            values = line.strip().split('\t')
            doc = {
                'name': values[0],
                'tposid': long(values[1])
            }
            #print doc

            try:
                #print 'Inserting region %d' % doc['RegionId']
                collection.insert(doc)
            except:
                print 'Unexpected error:', sys.exc_info()[0], sys.exc_info()[1]
                print line
                return
    print 'Done'



if __name__ == '__main__':
    main()