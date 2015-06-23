/**
 * DiseasesController
 *
 * @description :: Server-side logic for managing Diseases
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


module.exports = {
    /**
     * `DiseasesController.index()`
     */
    index: function (req, res) {
        Disease.find({}).populateAll().exec(function (err, diseases) {
            if (err) return next(err);
            res.view('admin/admin_diseases', {
                diseases: diseases,
                error: false,
                page:'admin_diseases'
            });
        });
    },
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
                disease: upd
            });
        });
    },
    /**
     * `DiseasesController.list()`
     */
    list: function (req, res) {
        Disease.find({}).populateAll().exec(function (err, diseases) {
            if (err) return next(err);
            return res.json({error: false, data: diseases});
        });
    },
    get: function (req, res) {
        var params = {};
        if(req.param('code') != null) {
            params = {code:req.param('code')};
        } else if(req.param('disease_id') != null) {
            params = {id:req.param('disease_id')};
        }
        Disease.find(params).populateAll().exec(function (err, diseases) {
            if (err) return next(err);
            return res.json({error: false, data: diseases});
        });
    },
    /**
     * `DiseasesController.edit()`
     */
    edit: function (req, res) {
        var d_id = req.param("disease_id");
        Symptom.find({}).exec(function(err, symptoms){
            if (err) return res.serverError(err);
            Disease.findOne(d_id).populateAll().exec(function (err, disease) {
                if (err) res.serverError(err);
                var m = [];
                _.forEach(disease.symptoms, function(s){
                    m.push(s.id);
                });
                res.view('admin/disease_edit', {
                    disease: disease,
                    symptoms:symptoms,
                    disease_symptoms: m.join(','),
                    error: false,
                    page: 'disease_edit'
                });
            });
        });
    },
    /**
     * `DiseasesController.delete()`
     */
    delete: function (req, res) {
        var disease_id = req.param("disease_id");
        var client = req.param("client") || 'dashboard';
        Disease.destroy({
            id: disease_id
        }).exec(function (err) {
            if (err) {
                console.log(err);
                var error = {error: true, message:'There was an error processing your request: \n' + JSON.stringify(err)};
                return res.clientAwareResponse(client, '/admin/diseases', error);
            } else {
                return res.clientAwareResponse(client, '/admin/diseases', {status:true, message:"Disease Deleted"});
            }
        });
    },
    symptoms_add:function(req,res) {
        var client = req.body.client || 'api';
        var symptom_id = req.body.symptom_id;
        var disease_id = req.body.disease_id;
        Disease.findOne(disease_id).populateAll().exec(function(err, disease){
            if (err) {
                console.log(err);
                var error = {error: true, message:'There was an error processing your request: \n' + JSON.stringify(err)};
                return res.clientAwareResponse(client, '/admin/diseases', error);
            } else {
                disease.symptoms.add(symptom_id);
                disease.save(function(err, disease_new){
                    if (err) {
                        console.log(err);
                        var error = {error: true, message:'There was an error processing your request: \n' + JSON.stringify(err)};
                        return res.clientAwareResponse(client, '/admin/diseases', error);
                    } else {
                        return res.clientAwareResponse(client, '/admin/diseases', {status:true, message:"Symptom added to the disease", disease:disease_new});
                    }
                });
            }
        });
    },
    symptoms_remove:function(req,res) {
        var client = req.body.client || 'api';
        var symptom_id = req.body.symptom_id;
        var disease_id = req.body.disease_id;
        Disease.findOne(disease_id).populateAll().exec(function(err, disease){
            if (err) {
                console.log(err);
                var error = {error: true, message:'There was an error processing your request: \n' + JSON.stringify(err)};
                return res.clientAwareResponse(client, '/admin/diseases', error);
            } else {
                disease.symptoms.remove(symptom_id);
                disease.save(function(err, disease_new){
                    if (err) {
                        console.log(err);
                        var error = {error: true, message:'There was an error processing your request: \n' + JSON.stringify(err)};
                        return res.clientAwareResponse(client, '/admin/diseases', error);
                    } else {
                        return res.clientAwareResponse(client, '/admin/diseases', {status:true, message:"Symptom removed from disease", disease:disease_new});
                    }
                });
            }
        });
    },
    symptoms:function(req, res) {
        var client = req.body.client || 'api';
        var symptoms = req.body.symptoms.split(',');
        var disease_id = req.body.disease_id;
        //console.log("disease_id", disease_id);
        //console.log("symptoms", symptoms, symptoms.length);
        Disease.findOne(disease_id).populateAll().exec(function(err, disease){
            if (err) {
                console.log(err);
                var error = {error: true, message:'There was an error processing your request: \n' + JSON.stringify(err)};
                return res.clientAwareResponse(client, '/admin/diseases', error);
            } else {
                var removables = [];
                _.forEach(disease.symptoms, function(item){
                    removables.push(item.id);
                });
                console.log("removables", removables);
                disease.symptoms.remove(removables);
                disease.save(function(err, disease_removed_symptoms){
                    disease_removed_symptoms.symptoms.add(symptoms);
                    disease_removed_symptoms.save(function(err, disease_new){
                        if (err) {
                            console.log(err);
                            var error = {error: true, message:'There was an error processing your request: \n' + err};
                            return res.clientAwareResponse(client, '/admin/diseases', error);
                        } else {
                            return res.clientAwareResponse(client, '/admin/diseases', {status:true, message:"Disease's Symptoms Updated", disease:disease_new});
                        }
                    });
                });
            }
        })
    }
};

