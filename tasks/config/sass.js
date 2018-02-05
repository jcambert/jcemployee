module.exports = function(grunt) { // Create new Grunt task



    grunt.config.set('sass', { // Task sass
        devMain: {
            files: [{
                expand: true, // 'expand directory'
                cwd: 'assets/styles/', // 'source folder'
                src: ['main.scss'], // 'source files'
                dest: '.tmp/public/styles/', // 'destination folder'
                ext: '.css' // 'extension of compiled file'
            }]
        },
        dev404: {
            files: [{
                expand: true, // 'expand directory'
                cwd: 'assets/styles/', // 'source folder'
                src: ['404.scss'], // 'source files'
                dest: '.tmp/public/styles/', // 'destination folder'
                ext: '.css' // 'extension of compiled file'
            }]
        },
        devAuth: {
            files: [{
                expand: true, // 'expand directory'
                cwd: 'assets/styles/', // 'source folder'
                src: ['auth.scss'], // 'source files'
                dest: '.tmp/public/styles/', // 'destination folder'
                ext: '.css' // 'extension of compiled file'
            }]
        }
    });

    //grunt.loadNpmTasks('grunt-sass-injection'); // start injection
    grunt.loadNpmTasks('grunt-sass'); // Load task Grunt-sass  
};