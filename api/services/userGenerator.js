var faker = require('faker');
module.exports = function(appToken, cb){
    var randomEmail = faker.internet.email();
    var randomGender = _.sample(['M', 'F'], 1);
    var randomDOB = faker.date.past(60).toISOString().slice(0,10).replace(/-/g,"-");
    var password = '123';
    var nick = faker.name.firstName();
    var user = {
        email:randomEmail,
        gender:randomGender,
        dob:randomDOB,
        password:password,
        nick:nick,
        app_token:appToken
    };
    console.log("generating user", user);
    User.create(user).exec(function(err, newUser){
        cb(err, newUser);
    });
};
