'use strict';
var path = require('path');
var eachAsync = require('each-async');
var assign = require('object-assign');
var sass = require('node-sass');

module.exports = function(grunt) {
    grunt.verbose.writeln('\n' + sass.info + '\n');
    grunt.log.writeln('\n configuring personnal sass-injection task');

    grunt.config.set('sass-injection', {

        devMain: {
            //target: 'toto',

            options: {
                target: 'assets/styles/main.scss',
                tag: 'inject'
            },
            files: [{
                expand: true,
                cwd: 'assets/styles/',

                src: ['sass/**/*.scss']
            }]

        }

    });


    grunt.registerMultiTask('sass-injection', 'Inject Sass partial files in target', function() {
        //grunt.log.writeln('\n running personnal sass-injection task ' + this.target);
        var self = this;
        self.importFiles = [];
        self.targetfile = this.data.options.target;

        //grunt.log.writeln(JSON.stringify(this.data.options.target));
        var opts = this.options({
            removeExtensions: true,
            tag: 'import'
        });

        this.files.forEach(function(el) {

            // grunt.log.writeln(JSON.stringify(el));
            var src = el.src[0];

            if (!src || path.basename(src)[0] !== '_') {
                //next();
                return;
            }
            if (opts.removeExtensions) {
                src = src.replace('.scss', '').replace('.sass', '').replace(el.orig.cwd, '');
            }
            self.importFiles.push('@import "' + src + '";');
            //grunt.log.writeln('Check injection for  dest ' + self.targetfile + ' in src ' + src);
        }, this);


        var startTag = '// ' + opts.tag;
        var endTag = "// end" + opts.tag;
        self.importFiles = self.importFiles.join('\n');
        //grunt.log.writeln(JSON.stringify(self.importFiles));
        grunt.log.writeln('StartTag:' + startTag);
        var readFile = grunt.file.read(self.targetfile);

        var begin = readFile.match(startTag);

        if (begin) {
            var end = readFile.match(endTag).index;
            var startReplace = begin.index + begin[0].length;
            var content = readFile.substring(0, startReplace) + '\n' + self.importFiles + '\n' + readFile.substring(end, readFile.length);
            grunt.file.write(self.targetfile, content);
        }
    });


};