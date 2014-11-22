module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({

        // Read properties from package.json
        pkg: grunt.file.readJSON('package.json'),

        // Clean project
        clean: {
            all: ['dist'],
            css: ['dist/themes/**/*.css'],
            js: ['dist/**/*.js'],
            img: ['dist/themes/*/img']
        },

        // Concat
        concat: {
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
        },

        // Uglify
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'dist/<%= pkg.name %>.jquery.js',
                dest: 'dist/<%= pkg.name %>.jquery.min.js'
            }
        },

        // Transpile SCSS
        sass: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src/themes/',
                    src: ['**/*.scss'],
                    dest: 'dist/themes',
                    ext: '.css'
                }]
            }
        },

        // Minify CSS
        cssmin: {
            my_target: {
                files: [{
                    expand: true,
                    cwd: 'dist/themes/',
                    src: ['**/*.css', '!**/*.min.css'],
                    dest: 'dist/themes/',
                    ext: '.min.css'
                }]
            }
        },

        //Copy theme images
        copy: {
            img: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/themes',
                        src: ['**/img/**/*.*'],
                        dest: 'dist/themes',
                        filter: 'isFile'
                    }
                ]
            }
        },

        // Watch
        watch: {
            css: {
                files: 'src/themes/**/*.scss',
                tasks: ['clean:css', 'sass', 'cssmin']
            },
            js: {
                files: 'src/ui/*.js',
                tasks: ['clean:js', 'concat', 'uglify']
            },
            img: {
                files: 'src/themes/*/img/**/*.*',
                tasks: ['clean:img', 'copy:img']
            }
        }
    });

    // Load
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', ['clean:all', 'concat', 'uglify', 'sass', 'cssmin', 'copy']);

};