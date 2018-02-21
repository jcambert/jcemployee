/**
 * IndexController
 *
 * @description :: Server-side logic for managing indices
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	get:function(req,res){
        res.locals.title='Gestion des presences'
        res.locals.layout='presence/layout';
        return res.view('presence/index');
    }
};

