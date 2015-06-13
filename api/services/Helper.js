module.exports = {
    isCurrentPage: function (req, controller, action) {
        if(action != null) {
            return (req.options.controller === controller && req.options.action === action)
        } else {
            return (req.options.controller === controller);
        }
    }
};