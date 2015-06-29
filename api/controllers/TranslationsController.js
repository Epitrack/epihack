var flash500 = require('../services/flash500');
/**
 * TranslationsController
 *
 * @description :: Server-side logic for managing Translations
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    /**
     * `TranslationsController.create()`
     */
    create: function (req, res) {
        var client = req.body.client || 'api';
        delete req.body.client;
        var app = req.body;
        Translation.create(app).exec(function createCB(err, b) {
            if (err) {
                return flash500(req, res, {
                    error: true,
                    message: 'There was an error processing your request: \n' + err
                });
            } else {
                return res.clientAwareResponse(client, '/admin/translations', {
                    error: false,
                    status: true,
                    message: "Translation Created",
                    translation: b
                });
            }
        });
    },
    /**
     * `TranslationsController.read()`
     */
    read: function (req, res) {
        var params = {};
        if (req.param('key') != null) {
            params = {key: req.param('key')};
        } else if (req.param('translation_id') != null) {
            params = {id: req.param('translation_id')};
        }
        Translation.find(params).exec(function (err, translations) {
            if (err) return flash500(req, res, {
                error: true,
                message: 'There was an error processing your request: \n' + err
            });
            return res.json({error: false, data: translations});
        });
    },
    /**
     * `TranslationsController.list()`
     */
    list: function (req, res) {
        Translation.find({}).exec(function (err, translations) {
            if (err) return flash500(req, res, {
                error: true,
                message: 'There was an error processing your request: \n' + err
            });
            return res.json({error: false, data: translations});
        });
    },
    /**
     * `TranslationsController.index()`
     */
    index: function (req, res) {
        Translation.find({}).exec(function(err, translations){
            if (err) return flash500(req, res, {
                error: true,
                message: 'There was an error processing your request: \n' + err
            });
            return res.view('translations/translation_index.ejs', {
                translations:translations,
                error:false,
                page:"translation_index"
            });
        });
    },
    /**
     * `TranslationsController.edit()`
     */
    edit: function (req, res) {
        var translation_id = req.param("translation_id");
        Translation.findOne(translation_id).exec(function (err, translation) {
            if (err) return flash500(req, res, {
                error: true,
                message: 'There was an error processing your request: \n' + err
            });
            return res.view('translations/translation_edit', {
                translation: translation,
                error: false,
                page:'translation_edit'
            });
        });
    },
    /**
     * `TranslationsController.update()`
     */
    update: function (req, res) {
        var client = req.body.client || 'api';
        delete req.body.client;
        var translation = req.body;
        Translation.update({
            id: translation.id
        }, translation).exec(function afterwards(err, upt) {
            if (err) return flash500(req, res, {
                error: true,
                message: 'There was an error processing your request: \n' + err
            });
            return res.clientAwareResponse(client, '/translations',
                {error:false, status:true, message:"Translation Updated", translation:upt});
        });
    },
    /**
     * `TranslationsController.delete()`
     */
    delete: function (req, res) {
        var translation_id = req.param("translation_id");
        var client = req.param('client') || 'dashboard';
        Translation.destroy({
            id: translation_id
        }).exec(function (err) {
            if (err) {
                return flash500(req, res, {
                    error: true,
                    message: 'There was an error processing your request: \n' + err
                });
            }
            else {
                return res.clientAwareResponse(client, '/admin/translations', {status:true, message:"Translation Deleted"});
            }
        });
    }
};

