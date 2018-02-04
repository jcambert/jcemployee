/**
 * Default model configuration
 * (sails.config.models)
 *
 * Unless you override them, the following properties will be included
 * in each of your models.
 *
 * For more info on Sails models, see:
 * http://sailsjs.org/#!/documentation/concepts/ORM
 */

module.exports.models = {

    /***************************************************************************
     *                                                                          *
     * Your app's default connection. i.e. the name of one of your app's        *
     * connections (see `config/connections.js`)                                *
     *                                                                          *
     ***************************************************************************/
    // connection: 'localDiskDb',

    /***************************************************************************
     *                                                                          *
     * How and whether Sails will attempt to automatically rebuild the          *
     * tables/collections/etc. in your schema.                                  *
     *                                                                          *
     * See http://sailsjs.org/#!/documentation/concepts/ORM/model-settings.html  *
     *                                                                          *
     ***************************************************************************/
    migrate: 'drop',
    schema: true,
    seed: function(callback) {
        var self = this;
        var modelName = self.adapter.identity.charAt(0).toUpperCase() + self.adapter.identity.slice(1);
        if (!self.seedData) {
            sails.log.debug('No data avaliable to seed ' + modelName);
            if (_.isFunction(callback))
                callback();
            return;
        }
        self.count().exec(function(err, count) {
            if (!err && count === 0) {
                sails.log.debug('Seeding ' + modelName + '...');
                if (self.seedData instanceof Array) {
                    self.seedArray(callback);
                } else {
                    self.seedObject(callback);
                }
            } else {
                sails.log.debug(modelName + ' had models, so no seed needed');
                if (_.isFunction(callback)) callback();
            }
        });
    },
    seedArray: function(callback) {
        var self = this;
        var modelName = self.adapter.identity.charAt(0).toUpperCase() + self.adapter.identity.slice(1);

        self.createEach(self.seedData).exec(function(err, results) {
            if (err) {
                sails.log.debug(err);
                if (_.isFunction(callback))
                    callback();
            } else {
                sails.log.debug(modelName + ' seed planted');
                if (_.isFunction(callback))
                    callback();
            }
        });
    },
    seedObject: function(callback) {
        var self = this;
        var modelName = self.adapter.identity.charAt(0).toUpperCase() + self.adapter.identity.slice(1);
        self.create(self.seedData).exec(function(err, results) {
            if (err) {
                sails.log.debug(err);
                if (_.isFunction(callback))
                    callback();
            } else {
                sails.log.debug(modelName + ' seed planted');
                if (_.isFunction(callback))
                    callback();
            }
        });

    }
};