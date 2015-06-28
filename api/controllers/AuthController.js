var bcrypt = require('bcrypt-nodejs');
var createAndSendToken = require('../services/createSendToken.js');
var flash500 = require('../services/flash500');
var flash403 = require('../services/flash403');
/**
 * AuthController
 *
 * @description :: Server-side logic for managing Auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    /**
     * `AuthController.loginUser()`
     */
    loginUser: function (req, res) {
        var client = req.body.client || 'api';
        var email = req.body.email;
        var password = req.body.password;
        if (!email || !password) {
            return flash403({
                message: 'email and password required'
            });
        }
        User.findOneByEmail(email).populateAll().exec(function (err, foundUser) {
            if (!foundUser) {
                error = {error: true, message: 'Unrecognized E-mail'};
                return res.clientAwareResponse(client, 'user/login', error);
            }
            bcrypt.compare(password, foundUser.password, function (err, valid) {
                if (err) {
                    error = {error: true, message: 'There was an error processing your request: \n' + err};
                    return res.clientAwareResponse(client, 'user/login', error);
                }

                if (!valid) {
                    var error = {error: true, message: 'Access Denied'};
                    return res.clientAwareResponse(client, 'user/login', error);
                }
                req.session.authenticated = true;
                req.session.User = foundUser;
                req.session.UserKind = 'user';
                if (client == 'api') {
                    return createAndSendToken(foundUser, res);
                } else {
                    return res.redirect("/user");
                }
            });
        });
    },
    /**
     * `AuthController.loginAdmin()`
     */
    loginAdmin: function (req, res) {
        if (req.method == 'POST') {
            var email = req.body.email;
            var password = req.body.password;
            var client = req.body.client || 'api';
            var error = false;
            if (!email || !password) {
                error = {error: true, message: 'Email and password required'};
                return res.clientAwareResponse(client, 'admin/login', error);
            }
            Admin.findOneByEmail(email, function (err, foundUser) {
                if (!foundUser) {
                    error = {error: true, message: 'Unrecognized E-mail'};
                    return res.clientAwareResponse(client, 'admin/login', error);
                }

                bcrypt.compare(password, foundUser.password, function (err, valid) {
                    if (err) {
                        error = {error: true, message: 'There was an error processing your request: \n' + err}
                        return res.clientAwareResponse(client, 'admin/login', error);
                    }

                    if (!valid) {
                        var error = {error: true, message: 'Access Denied'};
                        return res.clientAwareResponse(client, 'admin/login', error);
                    }

                    req.session.authenticated = true;
                    req.session.User = foundUser;
                    req.session.UserKind = 'admin';
                    if (client == 'api') {
                        return createAndSendToken(foundUser, res);
                    } else {
                        return res.redirect("/admin/");
                    }
                });

            });
        } else {
            return res.view('admin/login', {error: false});
        }
    },
    /**
     * `AuthController.logout()`
     */
    logout: function (req, res) {
        req.session.destroy();
        return res.redirect('/');
    }
};