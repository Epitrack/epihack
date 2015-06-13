var bcrypt = require('bcrypt-nodejs');
/**
 * User.js
 *
 * @description :: Represents a platform user
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {
        email: {type: 'email'},
        password: {type: 'string'},
        nick: {type: 'string'},
        dob: {type: 'date'},
        gender: {type: 'string', enum: ['M', 'F']},
        tw: {type: 'string'},
        fb: {type: 'string'},
        toJSON: function () {
            var obj = this.toObject();
            delete obj.password;
            delete obj.createdAt;
            return obj;
        }
    },
    beforeCreate: function (attr, next) {
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

