var request = require('request');
/**
 * Content.js
 *
 * @description :: A content describes a model to hold either list, detail or map content.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    attributes: {
        type: {type: 'string', enum: ['list', 'detail', 'map'], required: true},
        title: {type: 'string', required: true},
        body: {type: 'string', required: false},
        phone: {type: 'string', required: false},
        location: {type: 'array', required: false},
        items:{
            type:'array',
            required:false
        },
        app: {model: 'App', required: true}
    },
    queryPlaces:function (lat, lon, radius, types, cb){
        var key = "AIzaSyCytAf2M7q97Km5tWSGcEeQ-_-jyxrBrfc";
        var url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=" + key +
            "&location=" + lat+","+lon +
            "&types=" + types +
            "&radius=" + radius;
        console.log("url", url);
        request.get(url,
        function(err,httpResponse,body){
            //console.log("err", err);
            //console.log("httpResponse", httpResponse);
            //console.log("body", body);
            cb(JSON.parse(body).results);
        });
    }
};

