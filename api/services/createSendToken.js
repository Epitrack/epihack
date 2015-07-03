var jwt = require('jwt-simple');
var moment = require('moment');

module.exports = function (user, res) {
    var payload = {
        sub: user.id,
        exp: moment().add(1, 'days').unix()
    };
    var token = jwt.encode(payload, 'INSERT_APP_SECRET'); //TODO REPLACE INSERT_APP_SECRET WITH REAL APP SECRET
    return res.status(200).send({
        user: user.toJSON(),
        message: "Welcome, " + user.name || user.nickname || user.email,
        token: token
    });
};
