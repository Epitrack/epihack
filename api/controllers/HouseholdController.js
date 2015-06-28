var flash500 = require('../services/flash500');
/**
 * HouseholdController
 *
 * @description :: Server-side logic for managing Households members
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    /**
     * `HouseholdController.create()`
     */
    create: function (req, res) {
        var client = req.body.client || 'api';
        delete req.body.client;
        var redirectTo = req.body.redirect_to || (req.session.UserKind == 'admin' ? '/admin/users' : '/');
        delete req.body.redirect_to;
        var params = req.body;
        Household.create(params).exec(function createCB(err, hm) {
            if (err) {
                return flash500(req, res, {
                    error: true,
                    message: 'There was an error processing your request: \n' + err
                });
            } else {
                return res.clientAwareResponse(client, redirectTo, {
                    error: false,
                    status: true,
                    message: "Household member Created",
                    member: hm
                });
            }
        });
    },
    /**
     * `HouseholdController.read()`
     */
    read: function (req, res) {
        var params = {};
        if (req.param('household_id') != null) {
            params = {id: req.param('household_id')};
        } else if (req.param('user_id') != null) {
            params = {user: req.param('user_id')};
        }
        Household.find(params).populateAll().exec(function (err, user) {
            if (err) return flash500(req, res, {
                error: true,
                message: 'There was an error processing your request: \n' + err
            });
            return res.json({error: false, data: user});
        });
    },
    /**
     * `HouseholdController.list()`
     */
    list: function (req, res) {
        Household.find({}).exec(function (err, users) {
            if (err) return flash500(req, res, {
                error: true,
                message: 'There was an error processing your request: \n' + err
            });
            return res.json({error: false, data: users});
        });
    },
    /**
     * `HouseholdController.update()`
     */
    update: function (req, res) {
        var client = req.body.client || 'api';
        delete req.body.client;
        var params = req.body;
        Household.update({
            id: params.id
        }, params).exec(function afterwards(err, upb) {
            if (err) {
                return flash500(req, res, {
                    error: true,
                    message: 'There was an error processing your request: \n' + err
                });
            }
            return res.clientAwareResponse(client, '/admin/users', {
                error: false,
                status: true,
                message: "Household Member Updated",
                user: upb
            });
        });
    },
    edit: function (req, res) {
        var household_id = req.param("household_id");
        Household.findOne(household_id).exec(function (err, household_member) {
            if (err) return flash500(req, res, {
                error: true,
                message: 'There was an error processing your request: \n' + err
            });
            return res.view('admin/household_edit', {
                household_member: household_member,
                error: false,
                page:'household_edit'
            });
        });
    },
    /**
     * `HouseholdController.delete()`
     */
    delete: function (req, res) {
        var household_id = req.param("household_id");
        var client = req.param("client") || 'dashboard';
        var redirectTo = req.param("redirect_to") || (req.session.UserKind == 'admin' ? '/admin/users' : '/');
        Household.destroy({
            id: household_id
        }).exec(function (err) {
            if (err) {
                return flash500(req, res, {
                    error: true,
                    message: 'There was an error processing your request: \n' + err
                });
            } else {
                return res.clientAwareResponse(client, redirectTo, {status: true, message: "Household member removed"});
            }
        });
    },
    /**
     * `HouseholdController.surveys()`
     */
    surveys: function (req, res) {
        return res.json({
            todo: 'surveys() is not implemented yet!'
        });
    }
};

