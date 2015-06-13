/**
 * Symptom.js
 *
 * @description :: Represents a symptom of a disease
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    attributes: {
        name: {type: 'string'},
        isRequired: {type: 'boolean'},
        priority: {type: 'integer'}
    }
};