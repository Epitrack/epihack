var flash500 = require('./flash500');
var userGenerator = require('./userGenerator');
var faker = require('faker');
module.exports = function(req, res, diseaseCode, baseDate, limitDate, appToken, cb){
    Disease.findOne({code:diseaseCode}).populateAll().exec(function(err, d){
        if (err) {
            return flash500(req, res, {
                error: true,
                message: 'There was an error processing your request: \n' + err
            });
        } else {
            console.log("disease", d);
            var randomSymptoms = _.sample(d.symptoms, Math.round(Math.random() * d.symptoms.length));
            console.log("randomSymptoms", randomSymptoms);
            var symptomsTags = [];
            _.forEach(randomSymptoms, function(element, index, list){
               symptomsTags.push(element.code);
            });
            symptomsTags = symptomsTags.join(",");
            console.log("symptomsTags", symptomsTags);
            userGenerator(appToken, function(err, user){
                if (err) {
                    return flash500(req, res, {
                        error: true,
                        message: 'There was an error processing your request: \n' + err
                    });
                } else {
                    var randomSurvey = {
                        lat:faker.address.latitude(),
                        lon:faker.address.longitude(),
                        user_id:user.id,
                        symptoms:symptomsTags,
                        app_token:appToken,
                        ill_date:faker.date.between(baseDate, limitDate).toISOString().slice(0,10).replace(/-/g,"-")
                    };
                    Survey.create(randomSurvey).exec(function(err, survey){
                        if (err) {
                            return flash500(req, res, {
                                error: true,
                                message: 'There was an error processing your request: \n' + err
                            });
                        } else {
                            cb(err, survey);
                        }
                    });
                }
            });
        }
    });
};
