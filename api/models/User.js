var bcrypt = require('bcrypt-nodejs');
/**
 * User.js
 *
 * @description :: Represents a platform user
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    attributes: {
        email: {type: 'email', unique:true, required:true},
        password: {type: 'string', required:true},
        nick: {type: 'string', required:false},
        dob: {type: 'string', required:true},
        gender: {type: 'string', enum: ['M', 'F'], required:true},
        tw: {type: 'string', required:false},
        fb: {type: 'string', required:false},
        surveys: {
            collection: 'Survey',
            via: 'user'
        },
        household_members: {
            collection: 'HouseholdMember',
            via: 'user'
        },
        toJSON: function () {
            var obj = this.toObject();
            delete obj.password;
            delete obj.createdAt;
            return obj;
        }
    },
    beforeCreate: function (attr, next) {
        if(attr.dob == null) {
            attr.dob = attr.dob_month + '/' + attr.dob_year;
        }
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                next(err);
            }
            bcrypt.hash(attr.password, salt, null, function (err, hash) {
                if (err) next(err);
                attr.password = hash;
                next();
            });
        });
    },
    beforeUpdate: function (attr, next) {
        if (typeof(attr.password) === 'undefined') {
            delete attr.password;
            next();
        } else {
            bcrypt.genSalt(10, function (err, salt) {
                if (err) {
                    next(err);
                }

                bcrypt.hash(attr.password, salt, null, function (err, hash) {

                    if (err) next(err);

                    attr.password = hash;
                    next();

                });
            });
        }
    }
};

