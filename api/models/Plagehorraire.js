/**
 * Plagehorraire.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var timeFormat = /^([0-9]{2})\:([0-9]{2})$/;
var erp = require('../core/index.js');
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
            type: 'string',
            required: true,
            time: true
        },
        sortie: {
            type: 'string',
            required: true,
            time: true
        },
        employees: {
            collection: 'employee',
            via: 'plages'
        }
    },
    types: {
        time: function(t) {
            return timeFormat.test(t);
        }
    },
    beforeCreate: function(plage, next) {
        if (erp.pointage.compareTime(plage.entree, plage.sortie)) return next();
        return next("L'heure de sortie doit etre posterieur à l'heure d'entrée");
    },
    seedData: [
        //{ groupe: 1, jour: 1, entree: "08:00", sortie: "17:00" },
        //{ groupe: 1, jour: 2, entree: "08:00", sortie: "17:30" },
        { groupe: 2, jour: 1, entree: "09:00", sortie: "17:00" },
        { groupe: 2, jour: 2, entree: "09:30", sortie: "17:30" },
        { groupe: 1, jour: 7, entree: "08:30", sortie: "17:30" },
    ]
};