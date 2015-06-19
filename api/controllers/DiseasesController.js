/**
 * DiseasesController
 *
 * @description :: Server-side logic for managing Diseases
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


    /**
     * `DiseasesController.create()`
     */
    create: function (req, res) {
        var client = req.body.client || 'api';
        delete req.body.client;
        var params = req.body;
        Disease.create(params).exec(function createCB(err, d) {
            if (err) {
                var error = {error: 'There was an error processing your request:', message: JSON.stringify(err)};
                console.log(err);
                return res.clientAwareResponse(client, '/admin/diseases', error);
            } else {
                return res.clientAwareResponse(client, '/admin/diseases', {
                    error: false,
                    status: true,
                    message: "Disease Created",
                    disease: d
                });
            }
        });
    },


    /**
     * `DiseasesController.update()`
     */
    update: function (req, res) {
        var client = req.body.client || 'api';
        delete req.body.client;
        var disease = req.body;
        Disease.update({
            id: disease.id
        }, disease).exec(function afterwards(err, upd) {
            if (err) {
                console.log(err);
                var error = {error: 'There was an error processing your request:', message: JSON.stringify(err)};
                return res.clientAwareResponse(client, '/admin/diseases', error);
            }
            return res.clientAwareResponse(client, '/admin/diseases', {
                error: false,
                status: true,
                message: "Disease Updated",
                user: upd
            });
        });
    },


    /**
     * `DiseasesController.delete()`
     */
    delete: function (req, res) {
        return res.json({
            todo: 'delete() is not implemented yet!'
        });
    },


    /**
     * `DiseasesController.list()`
     */
    list: function (req, res) {
        Disease.find({}).exec(function (err, diseases) {
            if (err) return next(err);
            return res.json({error: false, data: diseases});
        });
    },

    get: function (req, res) {
        Disease.find({code:req.param('code')}).exec(function (err, diseases) {
            if (err) return next(err);
            return res.json({error: false, data: diseases});
        });
    },


    /**
     * `DiseasesController.edit()`
     */
    edit: function (req, res) {
        var d_id = req.param("disease_id");
        Disease.findOne(d_id).exec(function (err, disease) {
            if (err) return next(err);
            res.view('admin/disease_edit', {
                disease: disease,
                error: false,
                page: 'disease_edit'
            });
        });
    }
};

