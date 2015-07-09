var flash500 = require('../services/flash500');
/**
 * ContentController
 *
 * @description :: Server-side logic for managing Contents
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    /**
     * `ContentController.create()`
     */
    create: function (req, res) {
        var client = req.body.client || 'api';
        delete req.body.client;
        var content = req.body;
        Content.create(content).exec(function createCB(err, b) {
            if (err) {
                return flash500(req, res, {
                    error: true,
                    message: 'There was an error processing your request: \n' + err
                });
            } else {
                return res.clientAwareResponse(client, '/admin/content', {
                    error: false,
                    status: true,
                    message: "Content Created",
                    translation: b
                });
            }
        });
    },
    /**
     * `ContentController.read()`
     */
    read: function (req, res) {
        var params = {};
        if (req.param('app_token') != null) {
            params = {app: req.param('app_token')};
        } else if (req.param('id') != null) {
            params = {id: req.param('id')};
        } else {
            params = {};
        }
        Content.find(params).exec(function (err, content) {
            if (err) return flash500(req, res, {
                error: true,
                message: 'There was an error processing your request: \n' + err
            });
            return res.json({error: false, data: content});
        });
    },
    /**
     * `ContentController.update()`
     */
    update: function (req, res) {
        var client = req.body.client || 'api';
        delete req.body.client;
        var content = req.body;
        Translation.update({
            id: content.id
        }, content).exec(function afterwards(err, upc) {
            if (err) return flash500(req, res, {
                error: true,
                message: 'There was an error processing your request: \n' + err
            });
            return res.clientAwareResponse(client, '/admin/content',
                {error:false, status:true, message:"Content Updated", content:upc});
        });
    },
    /**
     * `ContentController.delete()`
     */
    delete: function (req, res) {
        var id = req.param("id");
        var client = req.param('client') || 'dashboard';
        Translation.destroy({
            id: id
        }).exec(function (err) {
            if (err) {
                return flash500(req, res, {
                    error: true,
                    message: 'There was an error processing your request: \n' + err
                });
            }
            else {
                return res.clientAwareResponse(client, '/admin/content', {status:true, message:"Content Deleted"});
            }
        });
    },
    /**
     * `ContentController.index()`
     */
    index: function (req, res) {
        App.find({}).exec(function (err, apps) {
            if (err) {
                return flash500({error: true, message: 'There was an error processing your request: \n' + err});
            }
            Content.find({}, {select: ['id', 'type', 'title', 'app']}).exec(function (err, contents) {
                if (err) return flash500(req, res, {
                    error: true,
                    message: 'There was an error processing your request: \n' + err
                });
                return res.view('content/content_index.ejs', {
                    contents: contents,
                    error: false,
                    apps:apps,
                    page: "content_index"
                });
            });
        });
    },
    /**
     * `ContentController.edit()`
     */
    edit: function (req, res) {
        var id = req.param("id");
        Content.findOne(id).exec(function (err, content) {
            if (err) return flash500(req, res, {
                error: true,
                message: 'There was an error processing your request: \n' + err
            });
            return res.view('content/content_edit', {
                content: content,
                error: false,
                page:'content_edit'
            });
        });
    },
    places:function(req, res){
        var lat = req.param('lat');
        var lon = req.param('lon');
        var radius = req.param('radius');
        var types = req.param('types');
        Content.queryPlaces(lat, lon, radius, types, function(result){
            return res.json(result);
        });
    }
};

