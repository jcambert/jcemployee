/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */
var moment = require('moment');
moment.locale('fr');
module.exports.routes = {

    /***************************************************************************
     *                                                                          *
     * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
     * etc. depending on your default view engine) your home page.              *
     *                                                                          *
     * (Alternatively, remove this and add an `index.html` file in your         *
     * `assets` directory)                                                      *
     *                                                                          *
     ***************************************************************************/
    'GET /welcome': function(req, res, next) {
        if (req.isSocket && req.method == 'GET') {
            _.forEach(sails.models, function(model) {
                model.watch(req.socket);

            });
            sails.sockets.join(req.socket, 'PresenceApplication');
            //Article.watch(req.socket);
            sails.sockets.broadcast('PresenceApplication', 'welcome', { greeting: 'Hola!' });
            return res.json({ message: 'Welcome' });
        }
    },
    'GET /': 'PageController.navigate',
    'GET /employee/bybadge/:badge': 'EmployeeContrller.byBadge',
    'PUT /plage': 'EmployeeController.setPlage',
    'PUT /entree': 'PointageController.entree',
    'PUT /sortie': 'PointageController.sortie',
    'GET /pointage/for/:id': 'PointageController.forEmployee',
    'PUT /solde': 'EmployeeController.solde',
    'PUT /heuresup': 'EmployeeController.heureSupplementaire',
    'GET /now': function(req, res) {
        sails.log.debug(req);
        moment.locale('fr');
        return res.json({ moment: moment().format(), date: new Date() });
    },
    /* '/': {
         view: 'homepage'
     },*/


    /***************************************************************************
     *                                                                          *
     * Custom routes here...                                                    *
     *                                                                          *
     * If a request to a URL doesn't match any of the custom routes above, it   *
     * is matched against Sails route blueprints. See `config/blueprints.js`    *
     * for configuration options and examples.                                  *
     *                                                                          *
     ***************************************************************************/

};