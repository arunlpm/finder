var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var fs = require('fs');

var siteInfo;
fs.readFile('pageMaps', 'utf8', function (err, data) {
  if (err) throw err;
  siteInfo = JSON.parse(data);
});

app.get('/scrape', function(req, res){

  baseUrl = req.query.url
  urlToCrawl = siteInfo[baseUrl]["urlToCrawl"]
  var options = {
	  url: urlToCrawl,
	  headers: {
	    'User-Agent': 'request'
	  }
  };

  request(options, function(error, resp, html){
  	if (!error){
  		var json = {"shippingPartner" : ""}
  		var $ = cheerio.load(html)
  		console.log(siteInfo[baseUrl]["selector"])
  		var shippingText = $(siteInfo[baseUrl]["selector"]).text()
  		var re = siteInfo[baseUrl]["regex"]
  		json.shippingPartner = shippingText.match(re)
  		res.send(json)
  	}
  	else{
  		res.send(error)
  	}
  })

})

app.listen('8081')

console.log('Magic happens on port 8081');

exports = module.exports = app;
