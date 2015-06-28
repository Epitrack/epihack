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
        app: {model: 'App', required: true},
        password: {type: 'string', required:true},
        nick: {type: 'string', required:false},
        dob: {type: 'string', required:true},
        gender: {type: 'string', enum: ['M', 'F'], required:true},
        tw: {type: 'string', required:false},
        fb: {type: 'string', required:false},
        picture: {type: 'string', required: false},
        surveys: {
            collection: 'Survey',
            via: 'user'
        },
        household: {
            collection: 'Household',
            via: 'user'
        },
        toJSON: function () {
            var obj = this.toObject();
            delete obj.password;
            return obj;
        }
    },
    beforeValidate: function (attr, next) {
        if (attr.password == '') {
            delete attr.password;
        }
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
        if (attr.app == null && attr.app_token != null) {
            console.log("injecting app token");
            App.findOne({token: attr.app_token}, function (err, app) {
                if (err || app.id == null) {
                    return res.status(500).send({
                        error: true,
                        message: 'Invalid app id: ' + err.toString()
                    });
                } else {
                    console.log("found app:", app.name, app.id);
                    attr.app = app.id;
                    delete attr.app_token;
                    next();
                }
            })
        } else {
            next();
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

