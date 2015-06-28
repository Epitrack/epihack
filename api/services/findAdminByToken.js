var jwt = require('jwt-simple');
module.exports = function (token, cb) {
    try {
        var payload = jwt.decode(token, 'INSERT_APP_SECRET'); //TODO REPLACE INSERT_CLIENT_SECRET WITH REAL APP SECRET
        Admin.find({id: payload.sub}).populateAll().exec(function (err, admin) {
            if (!admin) {
                cb(false);
            }
            cb(admin);
        });
    } catch (err) {
        console.log("findAdminByToken", err);
        cb(false);
    }
};
