/**
 * AppController
 *
 * @description :: Server-side logic for managing Apps
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    /**
     * `AppController.init()`
     */
    init: function (req, res) {
        return res.json({
            todo: 'init() is not implemented yet!'
        });
    },
    create:function(req, res) {
        var client = req.body.client || 'api';
        delete req.body.client;
        var app = req.body;
        App.create(app).exec(function createCB(err, b) {
            if (err) {
                var error = {error: 'There was an error processing your request:', message:JSON.stringify(err)};
                console.log(err);
                return res.clientAwareResponse(client, '/admin/config', error);
            } else {
                return res.clientAwareResponse(client, '/admin/config', {error:false, status:true, message:"App Created", app:b});
            }
        });
    },
    edit: function (req, res) {
        var app_id = req.param("app_id");
        App.findOne(app_id).exec(function (err, app) {
            if (err) return next(err);
            res.view('admin/app_edit', {
                app: app,
                error: false,
                page:'app_edit'
            });
        });
    },
    default:function(req, res){
        App.update({default:true}, {default:false}, function defaultUpdated(err, updatedConfig){
            if (err) {
                console.log(err);
                var error = {error: 'There was an error processing your request:', message:JSON.stringify(err)};
                return res.clientAwareResponse('dashboard', '/admin/config', error);
            }
            App.update({id:req.param('app_id')}, {default:true}, function configUpdated(err, c){
                if (err) {
                    console.log(err);
                    var error = {error: 'There was an error processing your request:', message:JSON.stringify(err)};
                    return res.clientAwareResponse('dashboard', '/admin/config', error);
                } else {
                    return res.clientAwareResponse('dashboard', '/admin/config', {error:false, status:true, message:"Configuration Updated", app:c});
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
                console.log(err);
                var error = {error: 'There was an error processing your request:', message:JSON.stringify(err)};
                return res.clientAwareResponse(client, '/admin/config', error);
            }
            return res.clientAwareResponse(client, '/admin/config', {error:false, status:true, message:"Configuration Updated", user:upb});
        });
    },
    delete: function (req, res) {
        var app_id = req.param("app_id");
        var client = 'dashboard';
        App.destroy({
            id: app_id
        }).exec(function (err) {
            if (err) {
                console.log(err);
                var error = {error: true, message:'There was an error processing your request: \n' + JSON.stringify(err)};
                return res.clientAwareResponse(client, '/admin/config', error);
            } else {
                return res.clientAwareResponse(client, '/admin/config', {status:true, message:"Configuration Deleted"});
            }
        });
    }
};