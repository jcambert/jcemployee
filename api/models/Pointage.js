/**
 * Pointage.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var moment = require('moment');
moment.locale('fr');
var erp = require('../core/index.js');
module.exports = {

    attributes: {
        entree: {
            type: 'datetime',
            defaultsTo: function() { return moment().add(1, 'h').toDate(); }, //new Date(); },
            required: true
        },
        sortie: {
            type: 'datetime'
        },
        entreereel: {
            type: 'datetime',
            //required: true
        },
        sortiereel: {
            type: 'datetime'
        },
        employee: {
            model: 'employee',
            via: 'pointages'
        },
        warning: {
            type: 'string',
            defaultsTo: ''
        }
    },
    beforeCreate: function(pointage, next) {
        Employee.findOne({ id: pointage.employee }).populate('plages')
            .then(function(employee) {

                if (employee.solde)
                    return next("Il est impossible de creer un pointage pour une personne sortie de l'entreprise");

                Pointage.find({ employee: pointage.employee }).sort('entreereel desc').limit(1).exec(function(err, last) {
                    if (err) return next(err);


                    if (!_.isUndefined(last[0]) && _.isUndefined(last[0].sortie)) {
                        return next("Veuillez saisir le pointage precedent");
                    }
                    var dow = moment(pointage.entree).isoWeekday();
                    //sails.log.debug("Day of week for in", dow);
                    var plage = _.find(employee.plages,
                        function(plage) {
                            return plage.jour === dow && erp.pointage.timeToFloat(plage.entree) >= erp.pointage.timeOfDateTimeToFloat(pointage.entree);
                        });
                    //sails.log.debug("finded plage", plage);
                    pointage.entreereel = pointage.entree;
                    pointage.heuresupplementaire = employee.heuresupplementaire;
                    if (_.isUndefined(plage)) {

                        pointage.warning += "Attention il n'y pas de plage en entree definie pour ce pointage\n";
                    } else {
                        _in = erp.pointage.splitTime(plage.entree);
                        if (pointage.heuresupplementaire) {

                            ptreel = moment(pointage.entreereel); //arrondi à l'heure supplementaire precedente
                            ptplage = moment(pointage.entreereel).hour(_in[0]).minute(_in[1]).second(0);
                            _in[0] = ptplage.hour() - ptreel.substract(ptplage).hour();
                            _in[1] = 0;
                            //pointage.entree = moment(pointage.entree).hour(_in).minute(0).second(0).toDate();

                        }
                        pointage.entree = moment(pointage.entree).hour(_in[0]).minute(_in[1]).second(0).toDate();

                    }
                    return next();
                });
            })
            .catch(function(err) {
                return next(err);
            });


    },
    beforeUpdate: function(pointage, next) {
        Employee.findOne({ id: pointage.employee }).populate('plages').exec(function(err, employee) {
            if (err) return next(err);
            if (_.isUndefined(employee))
                return next("Il est impossible de modifier une pointage pour cet employee");
            if (pointage.employee.solde)
                return next("Il est impossible de modifier un pointage pour une personne sortie de l'entreprise");
            // var dow = moment(pointage.sortie).isoWeekday();
            //sails.log.debug("Day of week for out", dow);

            Pointage.find({ employee: pointage.employee }).sort('entreereel desc').limit(1).exec(function(err, last) {
                if (err) return next(err);
                last = last[0];
                if (_.isUndefined(last) || !_.isUndefined(last.sortie)) {
                    return next("Veuillez saisir le pointage precedent");
                }
                var dow = moment(pointage.sortie).isoWeekday();
                // sails.log.debug("Day of week for out", dow);
                var plage = _.find(employee.plages,
                    function(plage) {
                        return plage.jour === dow && erp.pointage.timeToFloat(plage.sortie) <= erp.pointage.timeOfDateTimeToFloat(pointage.sortie);
                    });
                //sails.log.debug("finded plage", plage);
                pointage.sortiereel = pointage.sortie;
                if (_.isUndefined(plage)) {

                    pointage.warning += "Attention il n'y pas de plage en sortie definie pour ce pointage\n";
                } else {
                    _in = erp.pointage.splitTime(plage.sortie);
                    if (pointage.heuresupplementaire) {
                        ptreel = moment(pointage.entreereel); //arrondi à l'heure supplementaire precedente
                        ptplage = moment(pointage.entreereel).hour(_in[0]).minute(_in[1]).second(0);
                        _in[0] = ptplage.hour() + ptreel.substract(ptplage).hour();
                        _in[1] = 0;


                    }

                    pointage.sortie = moment(pointage.sortie).hour(_in[0]).minute(_in[1]).second(0).toDate();

                }
                return next();
            });
            //return next();
        });
    },
    afterCreate: function(pointage, next) {
        return updateEtat(pointage, next);
    },
    afterUpdate: function(pointage, next) {
        return updateEtat(pointage, next);
    },


};


function updateEtat(pointage, next) {
    var etat = _.isUndefined(pointage.sortie) ? 'Present' : 'Sorti';
    Employee.findOne({ id: pointage.employee }).exec(function(err, employee) {
        if (err) return next(err);
        if (_.isUndefined(employee)) return next("Cet employee n'existe pas");
        employee.etat = etat;
        employee.save(function() { return next(); });
    });
}