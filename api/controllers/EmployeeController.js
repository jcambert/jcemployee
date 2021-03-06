/**
 * EmployeeController
 *
 * @description :: Server-side logic for managing employees
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 var _ = require('lodash');
module.exports = {
    edit: function(req, res) {
       
        view = req.query.view || 'edit';
        res.locals.title = "Edition de l'employé";
        res.locals.layout = req.query.layout || "employee/layout";
        res.locals.employee = req.query.id;
        if(_.isUndefined(res.locals.employee))return res.badRequest('Pas d\'employe defini');
        return res.view('employee/' + view);
    },
    setPlage: function(req, res) {
        var empid = req.query.empid;
        var groupe = req.query.groupe;
        Employee.findOne({ id: empid }).populate('plages').exec(function(err, employee) {
            if (err) return res.badRequest(err);
            if (_.isUndefined(employee)) return res.badRequest("Cet employee n'existe pas");
            Plagehorraire.find({ groupe: groupe }).exec(function(err, plages) {
                if (err) return res.badRequest("La plage horraire n'existe pas");
                //employee.plages = [];
                var _plages = [];
                _.forEach(employee.plages, function(plage) {
                    employee.plages.remove(plage.id);
                });
                _.forEach(plages, function(plage) { _plages.push(plage.id); });
                employee.plages.add(_plages);
                employee.save(function() {
                    return res.ok();
                });
            });
        });
    },
    solde: function(req, res) {
        var empid = req.query.empid;
        Employee.findOne({ id: empid })
            .then(function(employee) {
                employee.solde = true;
                employee.save(function() { return res.ok(); });
            })
            .catch(function(err) { return res.badRequest("Cet employee n'existe pas"); });
    },
    heureSupplementaire: function(req, res) {
        var empid = req.query.empid;
        var enable = req.query.enable;
        Employee.findOne(_.pick(req.query, 'id'))
            .then(function(employee) {
                employee.heuresupplementaire = enable || !employee.heuresupplementaire;
                employee.save(function() {
                    return res.ok();
                });
            })
            .catch(function(err) {
                return res.badRequest(err);
            });
    },
    byBadge: function(req, res) {
        var badge = req.param('badge');
        if (_.isUndefined(badge)) return res.notFound();
        Employee.findOne({ badge: badge })
            .then(function(employee) {
                return res.json(employee);
            })
            .catch(function(err) {
                return res.notFound(err);
            });
    }
};