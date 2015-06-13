/**
 * App.js
 *
 * @description :: Represents the platform
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    attributes: {
        name: {type: 'string'},
        url: {type: 'string'},
        location: {type: 'string'},
        latitude: {type: 'integer'},
        longitude: {type: 'integer'},
        token: {type: 'string'},
        secret: {type: 'String'}
    }
};

