/**
 * HouseholdMember.js
 *
 * @description :: Describes a model for household member
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    attributes: {
        user: {model: 'User'},
        nick: {type: 'string'},
        gender: {type: 'string'},
        dob: {type: 'string'},
        surveys: {
            collection: 'Survey',
            via: 'household'
        }
    }
};
