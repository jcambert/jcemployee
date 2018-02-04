var events = require('events');
var fs = require('fs');

var erp = {};
erp = new events.EventEmitter();

erp.load = function load() {
    sails.on('lifted', function() {
        // Your post-lift startup code here
        erp.info([erp.name, 'Version:', erp.version, ' ready'].join(' '));
        // Erp is ready
        erp.emit('erp:ready');
    });
    // require all Erp dependencies
    erp.pointage = require('./pointage/index.js');

    // get Erp version number
    try {
        var json = JSON.parse(fs.readFileSync('package.json'));
        erp.name = json.name;
        erp.version = json.version;
        erp.description = json.description;
        erp.author = json.author;
        erp.info = sails.log.info;
        erp.error = sails.log.error;
        erp.warn = sails.log.warn;


    } catch (e) {
        sails.log.warn('Cannot parse package.json');
    }

    // init tasks
    //erp.task.init();

    // Erp modules contains all public methods of hooks
    erp.modules = sails.hooks;


};

module.exports = erp;