var flash500 = require('../services/flash500');
/**
 - * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    /**
     * `UserController.create()`
     */
    create: function (req, res) {
        var client = req.body.client || 'api';
        delete req.body.client;
        var user = req.body;
        User.create(user).exec(function createCB(err, b) {
            if (err) {
                return flash500(req, res, {
                    error: true,
                    message: 'There was an error processing your request: \n' + err
                });
            } else {
                return res.clientAwareResponse(client, '/admin/users', {
                    error: false,
                    status: true,
                    message: "User Created",
                    user: b
                });
            }
        });
    },
    /**
     * `UserController.read()`
     */
    read: function (req, res) {
        var params = {};
        if (req.param('email') != null) {
            params = {email: req.param('email')};
        } else if (req.param('user_id') != null) {
            params = {id: req.param('user_id')};
        }
        User.find(params).populateAll().exec(function (err, user) {
            if (err) return flash500(req, res, {
                error: true,
                message: 'There was an error processing your request: \n' + err
            });
            return res.json({error: false, data: user});
        });
    },
    /**
     * `UserController.list()`
     */
    list: function (req, res) {
        User.find({}).exec(function (err, users) {
            if (err) return flash500(req, res, {
                error: true,
                message: 'There was an error processing your request: \n' + err
            });
            return res.json({error: false, data: users});
        });
    },
    /**
     * `UserController.update()`
     */
    update: function (req, res) {
        var client = req.body.client || 'api';
        var redirectTo = req.session.UserKind == 'admin' ? '/admin/users' : '/user';
        delete req.body.redirect_to;
        delete req.body.client;
        var user = req.body;
        User.update({
            id: user.id
        }, user).exec(function afterwards(err, upb) {
            if (err) return flash500(req, res, {
                error: true,
                message: 'There was an error processing your request: \n' + err
            });
            return res.clientAwareResponse(client, redirectTo, {
                error: false,
                status: true,
                message: "User Updated",
                user: upb
            });
        });
    },
    edit: function (req, res) {
        var user_id = req.param("user_id");
        User.findOne(user_id).exec(function (err, user) {
            if (err) return flash500(req, res, {
                error: true,
                message: 'There was an error processing your request: \n' + err
            });
            return res.view('user/user_edit', {
                user: user,
                error: false,
                page:'user_edit'
            });
        });
    },
    /**
     * `UserController.delete()`
     */
    delete: function (req, res) {
        var user_id = req.param("user_id");
        var client = 'dashboard';
        User.destroy({
            id: user_id
        }).exec(function (err) {
            if (err) {
                return flash500(req, res, {
                    error: true,
                    message: 'There was an error processing your request: \n' + err
                });
            } else {
                return res.clientAwareResponse(client, '/admin/users', {status: true, message: "User Deleted"});
            }
        });
    },
    /**
     * `UserController.index()`
     */
    index: function (req, res) {
        App.find({}).exec(function (err, apps) {
            if (err) {
                return flash500({error: true, message: 'There was an error processing your request: \n' + err});
            }
            User.find({}).populate('app').exec(function (err, users) {
                if (err) return flash500(req, res, {
                    error: true,
                    message: 'There was an error processing your request: \n' + err
                });
                return res.view('admin/admin_users', {
                    users: users,
                    apps: apps,
                    error: false,
                    page: 'admin_users'
                });
            });
        });
    },
    login: function (req, res) {
        return res.view('user/login', {page: 'user_login'});
    },
    profile: function (req, res) {
        User.findOne(req.session.User.id).populateAll().exec(function (err, user) {
            console.log("profile", user);
            return res.view('user/user_profile', {
                page: 'user_profile',
                user: user
            });
        });
    },
    report: function (req, res) {
        Symptom.find({}).exec(function (err, symptoms) {
            if (err) return flash500(req, res, {
                error: true,
                message: 'There was an error processing your request: \n' + err
            });
            App.find({}).exec(function (err, apps) {
                if (err) {
                    return flash500(req, res, {
                        error: true,
                        message: 'There was an error processing your request: \n' + err
                    });
                } else {
                    return res.view('user/user_survey', {
                        symptoms: symptoms,
                        apps: apps,
                        error: false,
                        page: 'user_survey'
                    });
                }
            });

        });
    }
};