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
        var client = req.body.client || 'api';
        delete req.body.client;
        var admin = req.body;
        Admin.create(admin).exec(function createCB(err, b) {
            if (err) {
                var error = {error: 'There was an error processing your request:', message:JSON.stringify(err)};
                console.log(err);
                return res.clientAwareResponse(client, '/admin', error);
            } else {
                return res.clientAwareResponse(client, '/admin', {error:false, status:true, message:"User Created", user:b});
            }
        });
    },
    /**
     * `AdminController.list()`
     */
    list:function(req, res) {
        Admin.find({}).exec(function (err, users) {
            if (err) return next(err);
            return res.json({error:false, data:users});
        });
    },
    /**
     * `AdminController.update()`
     */
    update: function (req, res) {
        var client = req.body.client || 'api';
        delete req.body.client;
        var admin = req.body;
        Admin.update({
            id: admin.id
        }, admin).exec(function afterwards(err, upb) {
            if (err) {
                console.log(err);
                var error = {error: 'There was an error processing your request:', message:JSON.stringify(err)};
                return res.clientAwareResponse(client, '/admin', error);
            }
            return res.clientAwareResponse(client, '/admin', {error:false, status:true, message:"User Updated", user:upb});
        });
    },
    edit: function (req, res) {
        var admin_id = req.param("admin_id");
        Admin.findOne(admin_id).exec(function (err, user) {
            if (err) return next(err);
            res.view('admin/admin_edit', {
                user: user,
                error: false,
                page:'admin_edit'
            });
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
                error: false,
                page:'admin_index'
            });
        });
    },
    delete: function (req, res) {
        var admin_id = req.param("admin_id");
        var client = 'dashboard';
        Admin.destroy({
            id: admin_id
        }).exec(function (err, users) {
            if (err) {
                console.log(err);
                var error = {error: true, message:'There was an error processing your request: \n' + JSON.stringify(err)};
                return res.clientAwareResponse(client, '/admin', error);
            } else {
                return res.clientAwareResponse(client, '/admin', {status:true, message:"User Deleted"});
            }
        });
    },
    /**
     * `AdminController.login()`
     */
    login: function (req, res) {
        res.view('admin/login', {page:'admin_login'});
    },
    /**
     * `AdminController.config()`
     */
    config: function (req, res) {
        App.find({}).exec(function (err, configs) {
            if (err) return next(err);
            res.view('admin/admin_config', {
                configs: configs,
                error: false,
                page:'admin_config'
            });
        });
    },
    /**
     * `AdminController.surveys()`
     */
    surveys: function (req, res) {
        return res.view('admin/admin_surveys.ejs', {error:false, page:'admin_surveys'});
    }
};

