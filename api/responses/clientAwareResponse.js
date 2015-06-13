/**
 * Created by guinetik on 6/13/15.
 */
module.exports = function clientAwareResponse (client, view, data){
    var res = this.res;
    if (client == 'api') {
        return res.json(data);
    } else {
        sails.log.verbose('Returning view: \n',data);
        return res.view(view, data);
    }
};