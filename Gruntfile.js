module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({

        // Read properties from package.json
        pkg: grunt.file.readJSON('package.json'),

        // Concat
        concat: {
            ui: {
                options: {
                    banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n\n'+
                        '!(function ($) {\n\n',
                    footer: '\n\n})( jQuery );',
                    stripBanners: {
                        block: true
                    }
                },
                dist: {
                    src: ['src/ui/*.js'],
                    dest: 'dist/<%= pkg.name %>.jquery.js'
                }
            }
        },

        // Uglify
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'src/ui/*.js',
                dest: 'dist/<%= pkg.name %>.min.js'
            }
        }
    });

    // Load
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');

    // Default task(s).
    grunt.registerTask('default', ['concat', 'uglify']);

};