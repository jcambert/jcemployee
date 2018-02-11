/**
 * PresenceController
 *
 * @description :: Server-side logic for managing presences
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    get: function(req, res) {
        view = req.query.view || 'index';
        res.locals.title = "Gestionnaire de Presence";
        res.locals.layout = req.query.layout || "presence/layout";
        return res.view('presence/' + view);
    },

};