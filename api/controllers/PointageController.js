/**
 * PointageController
 *
 * @description :: Server-side logic for managing pointages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    entree: function(req, res) {
        var empid = req.query.empid;
        Pointage.create({ employee: empid }).exec(function(err) {
            if (err) return res.badRequest(err);
            return res.ok();
        });
    },
    sortie: function(req, res) {
        var empid = req.query.empid;

        Pointage.find({ employee: empid }).sort('entreereel desc').limit(1).exec(function(err, last) {
            if (err) return res.badRequest(err);
            last = last[0];
            if (_.isUndefined(last) || !_.isUndefined(last.sortie)) return res.badRequest(new Error("Vous devez deja saisir un mouvement en entrée"));
            last.sortie = new Date();
            last.save(function(err) {
                if (err) return res.badRequest(err);
                return res.ok();
            });
        });
    },
};