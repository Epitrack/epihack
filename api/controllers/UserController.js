var createAndSendToken = require('../services/createSendToken.js');
var bcrypt = require('bcrypt-nodejs');
/**
 * UserController
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
                var error = {error: 'There was an error processing your request:', message: JSON.stringify(err)};
                console.log(err);
                return res.clientAwareResponse(client, '/admin/users', error);
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
            if (err) return next(err);
            return res.json({error: false, data: user});
        });
    },
    /**
     * `UserController.list()`
     */
    list: function (req, res) {
        User.find({}).exec(function (err, users) {
            if (err) return next(err);
            return res.json({error: false, data: users});
        });
    },
    /**
     * `UserController.update()`
     */
    update: function (req, res) {
        var client = req.body.client || 'api';
        delete req.body.client;
        var user = req.body;
        User.update({
            id: user.id
        }, user).exec(function afterwards(err, upb) {
            if (err) {
                console.log(err);
                var error = {error: 'There was an error processing your request:', message: JSON.stringify(err)};
                return res.clientAwareResponse(client, '/admin/users', error);
            }
            return res.clientAwareResponse(client, '/admin/users', {
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
            if (err) return next(err);
            res.view('admin/user_edit', {
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
                console.log(err);
                var error = {
                    error: true,
                    message: 'There was an error processing your request: \n' + JSON.stringify(err)
                };
                return res.clientAwareResponse(client, '/admin/users', error);
            } else {
                return res.clientAwareResponse(client, '/admin/users', {status: true, message: "User Deleted"});
            }
        });
    },
    /**
     * `UserController.index()`
     */
    index: function (req, res) {
        User.find({}).exec(function (err, users) {
            if (err) return next(err);
            res.view('admin/admin_users', {
                users: users,
                error: false,
                page: 'admin_users'
            });
        });
    },
    /**
     * `UserController.login()`
     */
    login: function (req, res) {
        var client = req.body.client || 'api';
        var email = req.body.email;
        var password = req.body.password;
        if (!email || !password) {
            return res.status(401).send({
                message: 'email and password required'
            });
        }
        User.findOneByEmail(email).populateAll().exec(function (err, foundUser) {
            if (!foundUser) {
                return res.status(401).send({
                    message: 'User Not found'
                });
            }
            bcrypt.compare(password, foundUser.password, function (err, valid) {
                if (err) return res.status(403);
                if (!valid) {
                    return res.status(401).send({
                        message: 'User Not found'
                    });
                }
                if (client == 'api') {
                    createAndSendToken(foundUser, res);
                } else {
                    res.redirect("/");
                }
            });
        });
    }
};

