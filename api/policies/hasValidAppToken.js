var flash403 = require('../services/flash403');
var flash500 = require('../services/flash500');
/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function (req, res, next) {
    if (req.session.authenticated) {
        return next();
    } else {
        var client = req.param('client') || 'api';
        var app_token = req.param('app_token') || req.headers.app_token;
        console.log("app_token", app_token, req.headers.app_token, client);
        if (app_token != null) {
            App.findOne({token: app_token}, function (err, app) {
                if (err) {
                    return flash500(req, res, {error: true, message: 'Error Occurred'});
                } else {
                    if (app != undefined && app.token == app_token) {
                        return next();
                    } else {
                        return flash403(req, res, {error: true, message: 'Invalid App Token : hasValidAppToken 1'});
                    }
                }
            });
        } else {
            if (client == 'api') {
                return flash403(req, res, {
                    error: true,
                    message: 'You are not permitted to perform this action. : hasValidAppToken 2'
                });
            } else {
                var error = {error: true, message: 'Access Denied : hasValidAppToken'};
                return res.clientAwareResponse(client, 'admin/login', error);
            }
        }
    }
};
