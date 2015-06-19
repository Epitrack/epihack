var bcrypt = require('bcrypt-nodejs');
/**
 * Admin.js
 *
 * @description :: Represents a platform admin
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    attributes: {
        name: {type: 'string'},
        role: {type: 'String'},
        email: {type: 'email', unique:true},
        password: {type: 'string'},
        toJSON: function () {
            console.log(this);
            var obj = this;
            delete obj.password;
            delete obj.createdAt;
            delete obj.updatedAt;
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
            console.log("generating new password salt...");
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