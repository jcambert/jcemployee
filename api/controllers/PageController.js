/**
 * PageController
 *
 * @description :: Server-side logic for managing pages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    navigate: function(req, res) {
        var controller = req.query.controller;
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