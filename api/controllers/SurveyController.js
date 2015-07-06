var flash500 = require('../services/flash500');
var surveyGenerator = require('../services/surveyGenerator');
/**
 * SurveyController
 *
 * @description :: Server-side logic for managing Surveys
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    index: function (req, res) {
        return res.view('admin/admin_surveys.ejs', {error:false, page:'admin_surveys'});
    },
    /**
     * `SurveyController.create()`
     */
    create: function (req, res) {
        var user_id = req.body.user_id;
        var household_id = req.body.household_id;
        var client = req.body.client || 'api';
        var redirectTo = req.body.redirect_to || '/user';
        delete req.body.client;
        delete req.body.redirect_to;
        if (!user_id && !household_id) {
            return res.forbidden({
                error: true,
                message: 'user_id or household_id required.'
            });
        }
        var params = req.body;
        if (user_id != null) {
            params.user = user_id;
        }
        if (household_id != null) {
            params.household = household_id;
        }
        delete params.user_id;
        delete params.household_id;
        Survey.create(params).exec(function createCB(err, survey) {
            if (err) {
                var error = {
                    error: true,
                    title: 'Validation Error',
                    message: 'There was an error processing your request: \n' + err
                };
                if (err.code == 'E_VALIDATION') {
                    return res.clientAwareResponse(client, redirectTo, error);
                } else {
                    return flash500(req, res, error);
                }
            } else {
                return res.clientAwareResponse(client, redirectTo, {
                    error: false,
                    status: true,
                    message: "Survey Created",
                    survey: survey
                });
            }
        });
    },
    /**
     * `SurveyController.read()`
     */
    read: function (req, res) {
        var params = {};
        if (req.param('user_id') != null) {
            params = {user: req.param('user_id')};
        } else if (req.param('survey_id') != null) {
            params = {id: req.param('survey_id')};
        }
        Survey.find(params).exec(function (err, survey) {
            if (err) return flash500(req, res, {
                error: true,
                message: 'There was an error processing your request: \n' + err
            });
            return res.json({error: false, data: survey});
        });
    },
    getBySymptom: function (req, res) {
        var symptoms = req.param('symptoms');
        console.log('symptoms', symptoms);
        if (symptoms == null) {
            return res.status(401).send({
                error: true,
                message: 'symptoms list required.'
            });
        } else {
            Survey.find({where: {'symptoms': {'!': null, 'contains': symptoms}}}).exec(function (err, survey) {
                if (err) return flash500(req, res, {
                    error: true,
                    message: 'There was an error processing your request: \n' + err
                });
                return res.json({error: false, data: survey});
            });
        }
    },
    getByDisease: function (req, res) {
        var id_disease = req.param('id_disease');
        var code_disease = req.param('code');
        var params = {};
        if (id_disease != null) {
            params = {id: id_disease};
        } else if (code_disease != null) {
            params = {code: code_disease}
        } else {
            return res.status(401).send({
                error: true,
                message: 'id_disease or code_disease list required.'
            });
        }

        Disease.findOne(params).populateAll().exec(function (err, disease) {
            if (err) {
                return flash500(req, res, {
                    error: true,
                    message: 'There was an error processing your request: \n' + err
                });
            } else {
                if (disease.symptoms.length > 0) {
                    var symptoms = [];
                    _.forEach(disease.symptoms, function (symptom) {
                        symptoms.push(symptom.code);
                    });
                    symptoms = symptoms.join(',');
                    //TODO this query only contains symptoms codes. Future work must be done to make it compatible with symptoms' priority and requirement levels
                    Survey.find({where: {'symptoms': {'!': null, 'contains': symptoms}}}).exec(function (err, survey) {
                        if (err) {
                            return flash500(req, res, {
                                error: true,
                                message: 'There was an error processing your request: \n' + err
                            });
                        }
                        return res.json({error: false, data: survey});
                    });
                } else {
                    return res.status(401).send({
                        error: true,
                        message: 'This disease doesnt have symptoms'
                    });
                }
            }
        });
    },
    /**
     * `SurveyController.batch()`
     */
    batch: function (req, res) {
        var appToken = req.body.app_token;
        var diseaseCode = req.body.disease_code;
        var numSurveys = req.body.batch_ammount;
        var minDate = req.body.min_date;
        var maxDate = req.body.max_date;
        var client = req.body.client || 'api';
        var redirectTo = req.body.redirect_to || '/';
        var currentSurvey = 0;
        function single_callback(err){
            currentSurvey++;
            surveyCallback();
        }
        function surveyCallback(){
            if(currentSurvey >= numSurveys){
                return res.clientAwareResponse(client, redirectTo, {
                    error: false,
                    status: true,
                    message: "Batch Surveys Created"
                });
            }
        }
        for(var i = 0;i<numSurveys;i++){
            surveyGenerator(req, res, diseaseCode, minDate, maxDate, appToken, function(err, result){
                if (err) {
                    var error = {
                        error: true,
                        title: 'Validation Error',
                        message: 'There was an error processing your request: \n' + err
                    };
                    if (err.code == 'E_VALIDATION') {
                        return res.clientAwareResponse(client, redirectTo, error);
                    } else {
                        return flash500(req, res, error);
                    }
                } else {
                    single_callback();
                }
            });
        }
    }
};

