/**
 * PageController
 *
 * @description :: Server-side logic for managing pages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    navigate: function(req, res) {
        if(req.method!='GET' ||  req.isSocket)return res.badRequest();
        var controller = req.query.controller || 'index';
        var action = req.query.action || 'get';
        if (_.isUndefined(controller)) {
            return res.notFound();
        }
        try {
            return require('./' + controller + 'Controller')[action](req, res);
        } catch (err) {
            sails.log.error(err);
            return res.notFound();
        }
    }
};