/**
 * Plagehorraire.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
//var timeFormat = /^([0-9]{2})\:([0-9]{2})$/;
//var erp = require('../core/index.js');
module.exports = {

  attributes: {
    groupe: {
      type: 'integer',
      required: true,
      defaultsTo: 1,
      min: 0
    },
    jour: {
      type: 'integer',
      required: true,
      min: 1,
      max: 7
    },
    entree: {
      type: 'float',
      min: 0.0,
      max: 23.99,
      required: true,
      //time: true
    },
    sortie: {
      type: 'float',
      min: 0.0,
      max: 23.99,
      required: true,
      //time: true
    },
    employees: {
      collection: 'employee',
      via: 'plages'
    },
    pointages:{
        collection:'pointage',
        via:'plage'
    }
  },
  types: {
    /*time: function (t) {
      return timeFormat.test(t);
    }*/
  },
  beforeCreate: function (plage, next) {
    //if (erp.pointage.compareTime(plage.entree, plage.sortie)) return next();
    if(plage.sortie<=plage.entree)
        return next("L'heure de sortie doit etre posterieur à l'heure d'entrée");
    return next();
  },
  seedData: [
    //{ groupe: 1, jour: 1, entree: "08:00", sortie: "17:00" },
    //{ groupe: 1, jour: 2, entree: "08:00", sortie: "17:30" },
    {
      groupe: 2,
      jour: 1,
      entree: 8.5,
      sortie: 17.0
    },
    {
      groupe: 2,
      jour: 2,
      entree: 9.5,
      sortie: 17.5
    },
    {
      groupe: 1,
      jour: 1,
      entree: 8.5,
      sortie: 17.5
    },
  ]
};
