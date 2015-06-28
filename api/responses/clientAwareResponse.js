/**
 * Created by guinetik on 6/13/15.
 */
module.exports = function clientAwareResponse (client, view, data){
    var res = this.res;
    var req = this.req;
    if (client == 'api') {
        return res.json(data);
    } else {
        sails.log.verbose('Returning view: \n',data);
        req.session.flash = data;
        return res.redirect(view);
    }
};