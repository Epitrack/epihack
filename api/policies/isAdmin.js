var findAdminByToken = require('../services/findAdminByToken');
var flash403 = require('../services/flash403');
/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to check if authenticated user is an Admin
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function (req, res, next) {
    if (req.session.authenticated) {
        if (req.session.UserKind == 'admin') {
            return next();
        } else {
            return flash403(req, res, {error: true, message: 'Not Authorized : isAdmin'});
        }
    } else {
        if (req.header['admin_token'] != null) {
            var token = req.header['admin_token'];
            findAdminByToken(token, function (result) {
                if (result) {
                    return next();
                } else {
                    return flash403(req, res, {error: true, message: 'Invalid token: ' + token + ' : isAdmin'});
                }
            });
        } else {
            return flash403(req, res, {error: true, message: 'Missing admin_token : isAdmin'});
        }
    }
};
