var jwt = require('jwt-simple');
module.exports = function (token, cb) {
    try {
        var payload = jwt.decode(token, 'INSERT_APP_SECRET'); //TODO REPLACE INSERT_CLIENT_SECRET WITH REAL APP SECRET
        User.find({id: payload.sub}).populateAll().exec(function (err, foundUser) {
            if (!foundUser) {
                cb(false);
            }
            cb(foundUser);
        });
    } catch (err) {
        console.log("findOneByToken", err);
        cb(false);
    }
};
