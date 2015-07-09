var findUserByToken = require('../services/findUserByToken');
var flash403 = require('../services/flash403');
/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to check if authenticated user is a common user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function (req, res, next) {
    if (req.session.authenticated) {
        if (req.session.UserKind != 'admin') {
            return next();
        } else {
            return flash403(req, res, {error: true, message: 'Not Authorized : isUser', title: 'Error 403: '});
        }
    } else {
        if (req.header['user_token'] != null) {
            var token = req.header['user_token'];
            findUserByToken(token, function (result) {
                if (result) {
                    return next();
                } else {
                    return flash403(req, res, {error: true, message: 'Invalid token: ' + token + ' : isUser'});
                }
            });
        } else {
            return flash403(req, res, {error: true, message: 'Missing user_token : isUser'});
        }
    }
};
