/**
 * Employee.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var _ = require('lodash');
module.exports = {

    attributes: {
        nom: {
            type: 'string',
            required: true
        },
        prenom: {
            type: 'string',
            required: true
        },
        badge: {
            type: 'integer',
            required: true,
            unique: true,
            min: 1
        },
        dateentree: {
            type: 'date',
            defaultsTo: function() { return new Date(); }
        },
        datesortie: {
            type: 'date'
        },
        etat: {
            type: 'string',
            enum: ['Present', 'Sorti'],
            required: true,
            defaultsTo: 'Sorti'
        },
        solde: {
            type: 'boolean',
            defaultsTo: false
        },
        plages: {
            collection: 'plagehorraire',
            via: 'employees',
            dominant: true
        },
        pointages: {
            collection: 'pointage',
            via: 'employee'
        },
        heuresupplementaire: {
            type: 'boolean',
            defaultsTo: false
        }

    },
    types: {

    },
    beforeUpdate: function(employee, next) {
        if (_.isUndefined(employee.datesortie) && employee.solde)
            employee.datesortie = new Date();
        next();
    },
    beforeValidate: function(employee, next) {
        if (_.isUndefined(employee.badge)) {
            Employee.find({ sort: 'badge desc' }).limit(1).exec(function(err, result) {
                if (err) return next(err);
                sails.log.debug(result);
                if (_.isUndefined(result[0])) {
                    employee.badge = 1;
                } else {
                    employee.badge = (result[0].badge + 1) || 1;
                }
                return next();

            });

        } else {
            return next();
        }
    },
    afterCreate: function(employee, next) {
        sails.sockets.broadcast('PresenceApplication', 'employee', { verb: 'created', id: employee.id, data: employee });
        //Pointage.publishAdd(pointage.id, "Pointage", pointage);
        return next();
    },
    afterUpdate: function(employee, next) {
        //Pointage.publishUpdate(pointage.id, "Pointage", pointage);
        sails.sockets.broadcast('PresenceApplication', 'employee', { verb: 'updated', id: employee.id, data: employee });
        return next();
    },

    seedData: [
        { id: 1, nom: 'ambert', prenom: 'jean-christophe', badge: 1 },
        { id: 2, nom: 'ambert', prenom: 'maryline', badge: 2 },
        { id: 3, nom: 'ambert', prenom: 'loc', badge: 3, solde: true }
    ]
};