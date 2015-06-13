var bcrypt = require('bcrypt-nodejs');
var createAndSendToken = require('../services/createSendToken.js');
/**
 * AdminController
 *
 * @description :: Server-side logic for managing platform Admins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


    /**
     * `AdminController.create()`
     */
    create: function (req, res) {
        var admin = req.body;

        Admin.create(admin).exec(function createCB(err, b) {
            if (err) {
                module.exports.msgError = 'Erro ao criar usuário, por favor tente novamente.';
                console.log(err);
            }
            res.redirect('/admin');
        });
    },


    /**
     * `AdminController.update()`
     */
    update: function (req, res) {
        var admin = req.body;
        Admin.update({
            id: admin.id
        }, admin).exec(function afterwards(err, upb) {
            if (err) {
                module.exports.msgError = 'Erro ao atualizar usuário, por favor tente novamente.';
                console.log(err);
            }
            console.log(upb);
            res.redirect('/admin');
        });
    },


    /**
     * `AdminController.index()`
     */
    index: function (req, res) {
        Admin.find({}).limit(10).exec(function (err, users) {
            if (err) return next(err);
            res.view('admin/admin_index', {
                users: users,
                error: module.exports.msgError,
                page:'admin_index'
            });
            module.exports.msgError = ''
        })
    },

    delete: function (req, res) {
        var params = req.url.split('/');
        var param = params.pop();
        var id = param.replace('?id=', '');

        Admin.destroy({
            id: id
        }).exec(function (err, users) {
            if (err) module.exports.msgError = 'Erro ao deletar usuário, por favor tente novamente.';
            res.redirect('/admin/');
        });
    },


    /**
     * `AdminController.login()`
     */
    login: function (req, res) {
        return res.view({error:false});
    },

    /**
     * `AdminController.config()`
     */
    config: function (req, res) {
        return res.view('admin/admin_config.ejs', {error:false});
    },

    /**
     * `AdminController.users()`
     */
    users: function (req, res) {
        return res.view('admin/admin_users.ejs', {error:false});
    },

    /**
     * `AdminController.diseases()`
     */
    diseases: function (req, res) {
        return res.view('admin/admin_diseases.ejs', {error:false});
    },

    /**
     * `AdminController.surveys()`
     */
    surveys: function (req, res) {
        return res.view('admin/admin_surveys.ejs', {error:false});
    },

    processLogin: function (req, res) {
        if (req.method == 'POST') {
            var email = req.body.email;
            var password = req.body.password;
            var client = req.body.client || 'api';
            var error = false;
            if (!email || !password) {
                error = {error: 'Email and password required'};
                return res.clientAwareResponse(client, 'admin/login', error);
            }

            Admin.findOneByEmail(email, function (err, foundUser) {
                if (!foundUser) {
                    error = {error: 'Unrecognized E-mail'};
                    return res.clientAwareResponse(client, 'admin/login', error);
                }

                bcrypt.compare(password, foundUser.password, function (err, valid) {
                    if (err) {
                        error = {error: 'There was an error processing your request. Try again'};
                        return res.clientAwareResponse(client, 'admin/login', error);
                    }

                    if (!valid) {
                        var error = {error: 'Access Denied'};
                        return res.clientAwareResponse(client, 'admin/login', error);
                    }

                    req.session.authenticated = foundUser;
                    if(client == 'api') {
                        createAndSendToken(foundUser);
                    } else {
                        return res.clientAwareResponse(client, '/admin', foundUser);
                    }
                });

            });
        } else {
            return res.view('admin/login', {error: false});
        }
    }
};

