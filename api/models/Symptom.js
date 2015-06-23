/**
 * Symptom.js
 *
 * @description :: Represents a symptom of a disease
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    identity: "Symptom",
    attributes: {
        name: {type: 'string', required:true},
        code: {type: 'string', unique: true, required:true},
        is_required: {type: 'boolean', defaultsTo: false, required:false},
        priority: {type: 'integer', defaultsTo: 1, required:false},
        owners: {
            collection: 'Disease',
            via: 'symptoms'
        }
    }
};
