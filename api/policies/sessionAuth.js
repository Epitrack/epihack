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

    // User is allowed, proceed to the next policy,
    // or if this is the last policy, the controller
    if (req.session.authenticated) {
        return next();
    } else {
        if (req.header('app_token') != null) {
            var app_token = req.header('app_token');
            App.findOne({token: app_token}, function (err, app) {
                if (err) {
                    //console.log('bad request');
                    return res.badRequest(err);
                } else {
                    console.log("found app",app);
                    if (app != undefined && app.token == app_token) {
                        //console.log('token ok');
                        return next();
                    } else {
                        // User is not allowed
                        //console.log('token not ok');
                        return res.forbidden('Invalid App Token : sessionAuth');
                    }
                }
            });
        } else {
            // User is not allowed
            //console.log('User is not allowed');
            if(req.xhr) {
                return res.forbidden('You are not permitted to perform this action. : sessionAuth');
            } else {
                var error = {error: true, message: 'Access Denied : sessionAuth'};
                return res.clientAwareResponse('dashboard', 'admin/login', error);
            }
        }
    }
};
