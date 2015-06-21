/**
 * SymptomsController
 *
 * @description :: Server-side logic for managing Symptoms
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    /**
     * `DiseasesController.index()`
     */
    index: function (req, res) {
        Symptom.find({}).exec(function (err, symptoms) {
            if (err) return next(err);
            res.view('admin/admin_symptoms', {
                symptoms: symptoms,
                error: false,
                page:'admin_symptoms'
            });
        });
    },
    /**
     * `SymptomsController.create()`
     */
    create: function (req, res) {
        var client = req.body.client || 'api';
        var redirectTo = req.body.redirect_to || 'admin/diseases';
        delete req.body.client;
        var params = req.body;
        Symptom.create(params).exec(function createCB(err, c) {
            if (err) {
                var error = {error: 'There was an error processing your request:', message: JSON.stringify(err)};
                console.log(err);
                return res.clientAwareResponse(client, redirectTo, error);
            } else {
                return res.clientAwareResponse(client, redirectTo, {
                    error: false,
                    status: true,
                    message: "Symptom Created",
                    symptom: c
                });
            }
        });
    },
    /**
     * `SymptomsController.read()`
     */
    read: function (req, res) {
        var params = {};
        if(req.param('code') != null) {
            params = {code:req.param('code')};
        } else if(req.param('symptom_id') != null) {
            params = {id:req.param('symptom_id')};
        }
        Symptom.find(params).exec(function (err, symptom) {
            if (err) return next(err);
            return res.json({error: false, data: symptom});
        });
    },
    /**
     * `SymptomsController.update()`
     */
    update: function (req, res) {
        var client = req.body.client || 'api';
        delete req.body.client;
        var symptom = req.body;
        Symptom.update({
            id: symptom.id
        }, symptom).exec(function afterwards(err, upd) {
            if (err) {
                console.log(err);
                var error = {error: 'There was an error processing your request:', message: JSON.stringify(err)};
                return res.clientAwareResponse(client, '/admin/diseases', error);
            }
            return res.clientAwareResponse(client, '/admin/diseases', {
                error: false,
                status: true,
                message: "Symptom Updated",
                symptom: upd
            });
        });
    },
    /**
     * `SymptomsController.delete()`
     */
    delete: function (req, res) {
        var symptom_id = req.param("symptom_id");
        var client = req.param("client") || 'dashboard';
        Symptom.destroy({
            id: symptom_id
        }).exec(function (err) {
            if (err) {
                console.log(err);
                var error = {error: true, message:'There was an error processing your request: \n' + JSON.stringify(err)};
                return res.clientAwareResponse(client, '/admin/diseases', error);
            } else {
                return res.clientAwareResponse(client, '/admin/diseases', {status:true, message:"Symptom Deleted"});
            }
        });
    },
    /**
     * `SymptomsController.list()`
     */
    list: function (req, res) {
        Symptom.find({}).exec(function (err, symptoms) {
            if (err) return next(err);
            return res.json({error: false, data: symptoms});
        });
    }
};

