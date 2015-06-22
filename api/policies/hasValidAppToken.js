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
    var client = req.param('client') || 'api';
    var app_token = req.param('app_token') || req.headers.app_token;
    //console.log("app_token", app_token, req.headers.app_token, client);
    if (app_token != null) {
        App.findOne({token: app_token}, function (err, app) {
            if (err) {
                return res.badRequest(err);
            } else {
                if (app != undefined && app.token == app_token) {
                    return next();
                } else {
                    return res.forbidden({error: true, message: 'Invalid App Token : hasValidAppToken'});
                }
            }
        });
    } else {
        if (client == 'api') {
            return res.forbidden({
                error: true,
                message: 'You are not permitted to perform this action. : hasValidAppToken'
            });
        } else {
            var error = {error: true, message: 'Access Denied : hasValidAppToken'};
            return res.clientAwareResponse(client, 'admin/login', error);
        }
    }
};
