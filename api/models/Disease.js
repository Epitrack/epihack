/**
 * Disease.js
 *
 * @description :: Represents a disease. A disease is a collection of symptoms
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    identity:"Disease",
    attributes: {
        name: {type: 'string', required: true},
        code: {type: 'string', unique: true},
        symptoms: {
            collection: 'Symptom',
            via: 'owners',
            dominant: true
        }
    }
};

