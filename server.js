var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var jsonfile = require('jsonfile')
var app = express();
var path = require('path');
var file = __dirname + '/logs/out.csv';


// app.get('/scrape', function(req, res){
// 	scrapeStations(req, res);
// })

// function ConvertToCSV(objArray) {
//     var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
//     var str = '';

//     for (var i = 0; i < array.length; i++) {
//         var line = '';
//         for (var index in array[i]) {
//             if (line != '') line += ','

//             line += array[i][index];
//         }

//         str += line + '\r\n';
//     }

//     return str;
// }


function scrapeStations(req, res) {
    const url = 'https://gbfs.citibikenyc.com/gbfs/en/station_status.json';
    // Get all stations via GET request to URL
    request(url, function(error, response, html) {
        if (!error) {
            var allStations = JSON.parse(html).data.stations;
            let prettyHeaders = Object.keys(allStations[0]).map(field => {
                return field.replace(/_/g, ' ').toUpperCase();
            });

            let originalHeaders = Object.keys(allStations[0])

            // breaks every station in JSON format down to CSV format delimited by commas
            var csv = allStations.map(row => originalHeaders.map(fieldName => JSON.stringify(row[fieldName] || '')))

            // puts prettified headers as columns in CSV format
            csv.unshift(prettyHeaders)
           	csv.unshift('\r\n')
            csv = csv.join('\r\n')
            fs.appendFile(file, csv, function(err) {
            	console.log("logging stations at: ", new Date().toString());
            	if (err) console.error(err);
            })

        }
    })
}

// log station information every 10 minutes
setInterval(scrapeStations, 600000)


// app.listen('8081', function(){
// 	console.log('Json scraper listening at: 8081');
// })

// exports = module.exports = app;
