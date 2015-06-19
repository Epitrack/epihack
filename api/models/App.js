/**
 * App.js
 *
 * @description :: Represents the platform
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    attributes: {
        name: {type: 'string', required:true},
        language:{type:'string', required:true, defaultsTo:'PT-br'},
        url: {type: 'string', unique:true},
        location: {type: 'string', required:true},
        default:{type:'boolean', defaultsTo:false},
        latitude: {type: 'integer', required:true},
        longitude: {type: 'integer', required:true},
        token: {type: 'string', required:true},
        secret: {type: 'String', required:true}
    }
};

