/**
 * Disease.js
 *
 * @description :: Represents a disease. A disease is a collection of symptoms
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    attributes: {
        name: {type: 'string'},
        symptoms: {type: 'array'}
    }
};

