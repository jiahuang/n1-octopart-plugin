import _ from 'underscore';
import request from 'request';
import NylasStore from 'nylas-store';
import {FocusedContactsStore} from 'nylas-exports';
import OctopartAPIKey from './octopart-key';

class OctopartStore extends NylasStore {
  constructor() {
    super();

    this._part = null;
    this._searchText = "";
    this._cache = {};
    this._loading = false;
    this._error = null;
  }

  searchText() {
    return this._searchText;
  }

  partDetails() {
    return this._part;
  }

  loading() {
    return this._loading;
  }

  error() {
    return this._error;
  }

  part(){
    return this._part;
  }

  _getPart(partNum) {
    this._searchText = partNum;
    this._loading = true;
    var that = this;
    var url = "http://octopart.com/api/v3/parts/match?apikey="+OctopartAPIKey+"&queries="+ encodeURIComponent(JSON.stringify([{mpn:partNum}]))+"&"+ encodeURIComponent("include[]")+"=descriptions"+"&"+encodeURIComponent("include[]")+"=imagesets"

    console.log("url", url);
    request({url: url, headers: {'User-Agent': 'request'}, json: true}, function(err, res, body){
      console.log("got err", err)
      console.log("got back", body)
      if (err){
        // got err, display it
        that._error = err
      } else if (body.results[0].hits == 0) {
        // got no results, display err message
        that._error = "No results found ●︿●"
      } else {
        var firstItem = body.results[0].items[0]
        var description = firstItem.descriptions[0].value
        var image = firstItem.imagesets[0].small_image.url
        var manufacturer = {name: firstItem.manufacturer.name, url: firstItem.manufacturer.homepage_url}
        var mpn = firstItem.mpn;

        // initialize array of prices
        var prices = []
        Array(4).fill().map((_, i) => Math.pow(10, i) ).forEach(function(i){
          prices.push({qty: i, price: null, link: null})
        })

        // now iterate through all the offers and find the best for moqs of 1, 10, 100, 1000
        firstItem.offers.forEach(function(offer){
          console.log("offer", offer)
          if (!offer.prices.hasOwnProperty('USD') || offer.prices.USD.length < 0) {
            return
          }
          // each offer has multiple prices @ different moqs
          offer.prices.USD.forEach(function(moqPrice){
            var changePriceIndex = -1;
            var changePrice = prices.filter(function(p, index){
              if (p.qty == moqPrice[0]) {
                changePriceIndex = index
                return true
              }
              return false
              })

            console.log("change price", changePrice.length, changePrice, prices)
            if (changePrice.length != 0 && (changePrice[0].price == null || changePrice[0].price > moqPrice[1]) &&
            changePriceIndex != -1){
              // found a better price
              var updatePrice = {qty: changePrice[0].qty, price: Math.round(moqPrice[1]*1000)/1000, link: offer.product_url}

              // update array
              prices[changePriceIndex] = updatePrice
            }
          })
        })

        that._error = null;
        that._part = {description: description,
          image: image,
          manufacturer: manufacturer,
          prices: prices,
          mpn: mpn
        };

        console.log("got part", that._part)
      }

      that._loading = false;
      that.trigger(that);
    });
  }
}

export default new OctopartStore();
