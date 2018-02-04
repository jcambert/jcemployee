/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

/*
function Seed(model) {
    model.seed();
}*/



global.erp = require('../api/core/index.js');

module.exports.bootstrap = function(cb) {
    erp.load();
    async.series([
        Employee.seed,
        Plagehorraire.seed
    ], cb);
};