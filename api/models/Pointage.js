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
    date: {
      type: 'date',
      defaultsTo: function () {
        return new Date();
      },
      required: true,
    },
    entree: {
      type: 'float',
      min: 0.0,
      max: 23.99,
      defaultsTo: function () {
        return erp.pointage.now();
      },
      required: true
    },
    sortie: {
      type: 'float',
      min: 0.0,
      max: 23.99,
    },
    entreereel: {
      type: 'float',
      min: 0.0,
      max: 23.99,
      //required: true
    },
    sortiereel: {
      type: 'float',
      min: 0.0,
      max: 23.99,
    },
    heuresupplementaire: {
      type: 'boolean',
      defaultsTo: false
    },
    employee: {
      model: 'employee',
      via: 'pointages'
    },
    warning: {
      type: 'string',
      defaultsTo: ''
    },
    plage: {
      model: 'plagehorraire',
      via: 'pointages'
    }
  },
  types: {

  },
  beforeCreate: function (pointage, next) {
    Employee.findOne({
        id: pointage.employee
      }).populate('plages')
      .then(function (employee) {

        if (employee.solde)
          return next("Il est impossible de creer un pointage pour une personne sortie de l'entreprise");

        Pointage.find({
          employee: pointage.employee
        }).sort('date desc').sort('entreereel desc').limit(1).exec(function (err, last) {
          if (err) return next(err);


          if (!_.isUndefined(last[0]) && _.isUndefined(last[0].sortie)) {
            return next("Veuillez saisir le pointage precedent");
          }
          var dow = moment(pointage.date).isoWeekday();
          //sails.log.debug("Day of week for in", dow);
          var plage = _.find(employee.plages,
            function (plage) {
              return plage.jour === dow && plage.entree >= pointage.entree;
            });
          //sails.log.debug("finded plage", plage);
          pointage.entreereel = pointage.entree;
          pointage.heuresupplementaire = employee.heuresupplementaire;
          if (_.isUndefined(plage)) {

            pointage.warning += "Attention il n'y pas de plage en entree definie pour ce pointage\n";
          } else {
            pointage.plage = plage;
            if (pointage.entreereel > plage.entree) {
              pointage.entree = pointage.entreereel;
            } else if (pointage.heuresupplementaire) {
              delta = Math.abs(Math.trunc(plage.entree - pointage.entreereel));
              pointage.entree = plage.entree - delta;
              //pointage.entree = moment(pointage.entree).hour(_in).minute(0).second(0).toDate();

            } else

              pointage.entree = plage.entree;

          }
          return next();
        });
      })
      .catch(function (err) {
        return next(err);
      });


  },
  beforeUpdate: function (pointage, next) {
    Employee.findOne({
      id: pointage.employee
    }).populate('plages').exec(function (err, employee) {
      if (err) return next(err);
      if (_.isUndefined(employee))
        return next("Il est impossible de modifier une pointage pour cet employee");
      if (pointage.employee.solde)
        return next("Il est impossible de modifier un pointage pour une personne sortie de l'entreprise");
      // var dow = moment(pointage.sortie).isoWeekday();
      //sails.log.debug("Day of week for out", dow);

      Pointage.find({
        employee: pointage.employee
      }).sort('date desc').sort('entreereel desc').populate('plage').limit(1).exec(function (err, last) {
        if (err) return next(err);
        last = last[0];
        if (_.isUndefined(last) || !_.isUndefined(last.sortie)) {
          return next("Veuillez saisir le pointage precedent");
        }
        var dow = moment(pointage.date).isoWeekday();
        // sails.log.debug("Day of week for out", dow);
        var plage = _.find(employee.plages,
          function (plage) {
            return plage.jour === dow && plage.sortie <= pointage.sortie;
          });
        //sails.log.debug("finded plage", plage);
        pointage.sortiereel = pointage.sortie;


        /* if (_.isUndefined(pointage.plage) && _.isUndefined(plage)) {

           pointage.warning += "Attention il n'y pas de plage en sortie definie pour ce pointage\n";
           return next();
         } else*/
        {
          // _in = erp.pointage.splitTime(plage.sortie);
          Plagehorraire.findOne({
              id: pointage.plage
            })
            .then(function (plage) {
              if (_.isUndefined(plage)) {
                plage = _.find(employee.plages,
                  function (plage) {
                    return plage.jour === dow && plage.sortie <= pointage.sortie;
                  });
                if (_.isUndefined(plage)) {
                  pointage.warning += "Attention il n'y pas de plage en sortie definie pour ce pointage\n";
                  return next();
                }
              }
              if (pointage.sortiereel < plage.sortie) {
                pointage.sortie = pointage.sortiereel;
              } else if (pointage.heuresupplementaire) {
                delta = Math.abs(Math.trunc(plage.sortie - pointage.sortiereel));
                pointage.sortie = plage.sortie + delta;


              } else

                pointage.sortie = plage.sortie; // moment(pointage.sortie).hour(_in[0]).minute(_in[1]).second(0).toDate();
              return next();
            })
            .catch(function (err) {
              return next(err);
            });


        }

      });
      //return next();
    });
  },
  afterCreate: function (pointage, next) {
    return updateEtat(pointage, next);
  },
  afterUpdate: function (pointage, next) {
    return updateEtat(pointage, next);
  },


};


function updateEtat(pointage, next) {
  var etat = _.isUndefined(pointage.sortie) ? 'Present' : 'Sorti';
  Employee.findOne({
    id: pointage.employee
  }).exec(function (err, employee) {
    if (err) return next(err);
    if (_.isUndefined(employee)) return next("Cet employee n'existe pas");
    employee.etat = etat;
    employee.save(function () {
      return next();
    });
  });
}
