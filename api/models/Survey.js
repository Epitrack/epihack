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

        household: {model: 'HouseholdMember'},

        /**
         * An array of symptoms
         */

        symptoms: {type: 'array'},

        /**
         * The date the User started feeling the symptoms
         */

        ill_date: {type: 'date'},

        /**
         * GPS Coords
         */

        lat: {type: 'integer'},

        lon: {type: 'integer'},

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
         * The platform in which this survey was submitted. usually: web, ios, android
         */

        platform: {type: 'string', enum: ['web', 'ios', 'android']}
    }
};

