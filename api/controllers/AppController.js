var flash500 = require('../services/flash500');
/**
 * AppController
 *
 * @description :: Server-side logic for managing Apps
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    index: function (req, res) {
        App.find({}).exec(function (err, configs) {
            if (err) return flash500(req, res, {
                error: true,
                message: 'There was an error processing your request: \n' + err
            });
            return res.view('app/app_index', {
                configs: configs,
                error: false,
                page:'app_config'
            });
        });
    },
    create:function(req, res) {
        var client = req.body.client || 'api';
        delete req.body.client;
        var app = req.body;
        App.create(app).exec(function createCB(err, b) {
            if (err) {
                return flash500(req, res, {
                    error: true,
                    message: 'There was an error processing your request: \n' + err
                });
            } else {
                return res.clientAwareResponse(client, '/admin/apps', {error:false, status:true, message:"App Created", app:b});
            }
        });
    },
    /**
     * `AppController.read()`
     */
    read: function (req, res) {
        var params = {};
        if(req.param('token') != null) {
            params = {token:req.param('token')};
        } else if(req.param('app_id') != null) {
            params = {id:req.param('app_id')};
        }
        App.find(params).exec(function (err, apps) {
            if (err) return flash500(req, res, {
                error: true,
                message: 'There was an error processing your request: \n' + err
            });
            return res.json({error: false, data: apps});
        });
    },
    /**
     * `AppController.list()`
     */
    list: function (req, res) {
        App.find({}).exec(function (err, apps) {
            if (err) return flash500(req, res, {
                error: true,
                message: 'There was an error processing your request: \n' + err
            });
            return res.json({error: false, data: apps});
        });
    },
    edit: function (req, res) {
        var app_id = req.param("app_id");
        App.findOne(app_id).exec(function (err, app) {
            if (err) return flash500(req, res, {
                error: true,
                message: 'There was an error processing your request: \n' + err
            });
            return res.view('app/app_edit', {
                app: app,
                error: false,
                page:'app_edit'
            });
        });
    },
    default:function(req, res){
        App.update({default:true}, {default:false}, function defaultUpdated(err, updatedConfig){
            if (err) {
                return flash500(req, res, {
                    error: true,
                    message: 'There was an error processing your request: \n' + err
                });
            }
            App.update({id:req.param('app_id')}, {default:true}, function configUpdated(err, c){
                if (err) {
                    return flash500(req, res, {
                        error: true,
                        message: 'There was an error processing your request: \n' + err
                    });
                } else {
                    return res.clientAwareResponse('dashboard', '/admin/apps', {error:false, status:true, message:"Configuration Updated", app:c});
                }
            });
        });
    },
    update: function (req, res) {
        var client = req.body.client || 'api';
        delete req.body.client;
        var app = req.body;
        App.update({
            id: app.id
        }, app).exec(function afterwards(err, upb) {
            if (err) {
                return flash500(req, res, {
                    error: true,
                    message: 'There was an error processing your request: \n' + err
                });
            }
            return res.clientAwareResponse(client, '/admin/apps',
                {error:false, status:true, message:"Configuration Updated", config:upb});
        });
    },
    delete: function (req, res) {
        var app_id = req.param("app_id");
        var client = req.param('client') || 'api';
        App.destroy({
            id: app_id
        }).exec(function (err) {
            if (err) {
                return flash500(req, res, {
                    error: true,
                    message: 'There was an error processing your request: \n' + err
                });
            } else {
                return res.clientAwareResponse(client, '/admin/apps', {status:true, message:"Configuration Deleted"});
            }
        });
    }
};
