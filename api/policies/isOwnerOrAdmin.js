var findAdminByToken = require('../services/findAdminByToken');
var findUserByToken = require('../services/findUserByToken');
var flash403 = require('../services/flash403');
/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to check if current user is an admin or is owner of the requested resource
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function (req, res, next) {
    var idTOCompare = req.param('id') || req.param('user_id');
    if (req.session.authenticated) {
        if (req.session.UserKind == 'admin') {
            return next();
        } else {
            if (idTOCompare == req.session.User.id) {
                return next();
            } else {
                return flash403(req, res, {error: true, message: 'Not Authorized : isOwnerOrAdmin'});
            }
        }
    } else {
        if (req.headers['admin_token'] != null) {
            var token = req.headers['admin_token'];
            findAdminByToken(token, function (result) {
                if (result) {
                    return next();
                } else {
                    return flash403(req, res, {
                        error: true,
                        message: 'Invalid admin_token: ' + token + ' : isOwnerOrAdmin'
                    });
                }
            });
        } else if (req.headers['user_token'] != null) {
            var user_token = req.headers['user_token'];
            findUserByToken(user_token, function (result) {
                if (result) {
                    if (idTOCompare == result.id) {
                        next();
                    } else {
                        return flash403(req, res, {
                            error: true,
                            message: 'Invalid admin_token: ' + token + ' : isOwnerOrAdmin'
                        });
                    }
                } else {
                    return flash403(req, res, {
                        error: true,
                        message: 'Invalid user_token: ' + token + ' : isOwnerOrAdmin 3'
                    });
                }
            });
        } else {
            return flash403(req, res, {error: true, message: 'Invalid token : isOwnerOrAdmin 3'});
        }
    }
};
