import sys
import json
import requests
#from requests.auth import HTTPBasicAuth
import numpy as np


class UrlFactory:
    def __init__(self, domain):
        self.domain = domain

    def url_promo_score(self, hotel_id):
        return self.domain + '/promotions/v1/hotels/%s/promos?returnScore=true' % hotel_id

    def url_top_pos(self, hotel_id):
        return self.domain + '/top-tpids/lodgingSort/v1/hops/HopsTopTpidsAndRegions?hotelId=%s' % hotel_id


def main():
    url_factory = UrlFactory('https://services.expediapartnercentral.com')
    url = url_factory.url_promo_score(hotel_id='12933873')
    response = requests.get(url, auth=('EQCtest12933873','cc47an46'))
    if response.status_code != 200:
        print 'Error'
        return

    page = json.loads(response.content)
    rate_plan_scores = np.array([rp['score'] for rp in page['Entity']])

    #for rp in page['Entity']:
    #    print '%s: %s' % (rp['id'], rp['score'])

    print rate_plan_scores

if __name__ == '__main__':
    main()