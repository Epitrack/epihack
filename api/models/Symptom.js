/**
 * Symptom.js
 *
 * @description :: Represents a symptom of a disease
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    identity:"Symptom",
    attributes: {
        name: {type: 'string'},
        code: {type: 'string', unique:true},
        is_required: {type: 'boolean'},
        priority: {type: 'integer'},
        owners:{
            collection:'Disease',
            via:'symptoms'
        }
    }
};