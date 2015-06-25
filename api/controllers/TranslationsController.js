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
                var error = {error: 'There was an error processing your request:', message: JSON.stringify(err)};
                console.log(err);
                return res.clientAwareResponse(client, '/admin/translations', error);
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
            if (err) return next(err);
            return res.json({error: false, data: translations});
        });
    },
    /**
     * `TranslationsController.list()`
     */
    list: function (req, res) {
        Translation.find({}).exec(function (err, translations) {
            if (err) return next(err);
            return res.json({error: false, data: translations});
        });
    },
    /**
     * `TranslationsController.index()`
     */
    index: function (req, res) {
        Translation.find({}).exec(function(err, translations){
            return res.view('admin/admin_translations.ejs', {
                translations:translations,
                error:false,
                page:"admin_translations"
            });
        });
    },
    /**
     * `TranslationsController.edit()`
     */
    edit: function (req, res) {
        var translation_id = req.param("translation_id");
        Translation.findOne(translation_id).exec(function (err, translation) {
            if (err) return next(err);
            res.view('admin/translation_edit', {
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
            if (err) {
                console.log(err);
                var error = {error: 'There was an error processing your request:', message:JSON.stringify(err)};
                return res.clientAwareResponse(client, '/admin/translations', error);
            }
            return res.clientAwareResponse(client, '/admin/translations',
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
                console.log(err);
                var error = {error: true, message:'There was an error processing your request: \n' + JSON.stringify(err)};
                return res.clientAwareResponse(client, '/admin/translations', error);
            } else {
                return res.clientAwareResponse(client, '/admin/translations', {status:true, message:"Translation Deleted"});
            }
        });
    }
};

