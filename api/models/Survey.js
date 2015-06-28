/**
 * Survey.js
 *
 * @description :: Represents a Survey taken by the User. Surveys are collection of reported Symptoms, and other queries like if User has sought Healthcare, had contact with symptomatic people or had traveled abroad. The user's gps coords are also required
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {
        /**
         * The user that submitted this survey. Can be null
         */
        user: {model: 'User'},
        /**
         * The household member target for this survey. Can be null
         */
        household: {model: 'Household'},
        /**
         * Comma separated list of symptoms codes. Think of it as tags.
         * To obtain the list of symptoms codes for the disease you want to cover, use /diseases/get
         * To obtain list of all symptoms codes, use /symptoms/list
         */
        symptoms: {type: 'string', required: false},
        /**
         * The date the User started feeling the symptoms
         */
        ill_date: {type: 'date', required: true},
        /**
         * GPS Coords
         */
        lat: {type: 'float', required: true},
        lon: {type: 'float', required: true},
        coordinates: {type: 'json'},
        /**
         * User's zip. can be null
         */
        zip: {type: 'string', required: false},
        /**
         * If the user has had contact with any symptomatic person
         */
        hadContagiousContact: {type: 'boolean'},
        /**
         * If the user has sought healthcare attention
         */
        hadHealthCare: {type: 'boolean'},
        /**
         * If the user had travelled abroad
         */
        hadTravelledAbroad: {type: 'boolean'},
        /**
         * Where the user had travelled to. Can be null
         */
        travelLocation: {type: 'string'},
        /**
         * App token for this survey
         */
        app_token: {type: 'string'},
        /**
         * The platform in which this survey was submitted. usually: web, ios, android
         */
        platform: {type: 'string', enum: ['web', 'ios', 'android']}
    },
    beforeValidate: function (survey, next) {
        if (survey.coordinates == null) {
            survey.coordinates = [
                survey.lon,
                survey.lat
            ];
            next();
        } else {
            console.log("survey coordinates", survey.coordinates);
            next();
        }
    },
    search: function (location) {
        // Let's build up a MongoDB query
        var query = {};
        // We need to use `native` for geo queries
        Survey.native(function (err, collection) {
            // Co-ordinates are passed from the client side (GMaps JS API)
            // Note that we don't get them server-side because apparently
            // the server-side API isn't designed for real-time user searches.
            // Probably too slow or something.
            collection.find(
                query.coordinates = {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: [ // long then lat
                                location.coordinates.longitude,
                                location.coordinates.latitude
                            ]
                        },
                        $maxDistance: 100
                    }
                });

        });
    }
};

