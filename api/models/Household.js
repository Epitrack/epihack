/**
 * HouseholdMember.js
 *
 * @description :: Describes a model for household member
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    attributes: {
        user: {model: 'User', required:true},
        nick: {type: 'string', required:true},
        gender: {type: 'string', required:true},
        dob: {type: 'string', required:true},
        surveys: {
            collection: 'Survey',
            via: 'household'
        }
    },
    beforeValidate: function (attr, next) {
        if (attr.picture == null || attr.picture == "") {
            if (attr.gender == 'M') {
                attr.picture = 'https://cdn3.iconfinder.com/data/icons/softicons/PNG/User-Male.png';
            } else {
                attr.picture = 'https://cdn3.iconfinder.com/data/icons/softicons/PNG/User-Female.png';
            }
        }
        if (attr.dob == null && attr.dob_month != null && attr.dob_year != null) {
            console.log("injecting dob");
            attr.dob = attr.dob_month + '/' + attr.dob_year;
            delete attr.dob_month;
            delete attr.dob_year;
        }
        next();
    }
};
