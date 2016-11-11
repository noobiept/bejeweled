module.exports = function( grunt )
{
var root = './';
var dest = 'release/<%= pkg.name %> <%= pkg.version %>/';
var temp = 'temp/';

grunt.initConfig({
        pkg: grunt.file.readJSON( 'package.json' ),

            // delete the destination and temporary folders
        clean: {
            previousBuild: [
                dest
            ],
            afterBuild: [
                temp,
                '.tscache'
            ]
        },

            // copy the necessary files
        copy: {
            release: {
                expand: true,
                cwd: root,
                src: [
                    'images/*.png',
                    'libraries/**',
                    'sounds/**'
                ],
                dest: dest
            }
        },

            // compile to javascript
        ts: {
            release: {
                src: [ root + 'scripts/*.ts' ],
                dest: temp + 'code.js',
                options: {
                    "noImplicitAny": true,
                    "noImplicitReturns": true,
                    "noImplicitThis": true,
                    "noUnusedLocals": true,
                    "strictNullChecks": true,
                    "target": "es5"
                }
            }
        },

        uglify: {
            release: {
                files: [{
                    src: temp + 'code.js',
                    dest: dest + 'min.js'
                }]
            }
        },

        cssmin: {
            release: {
                files: [{
                    expand: true,
                    cwd: root + 'css/',
                    src: '*.css',
                    dest: dest + 'css/'
                }]
            },
            options: {
                advanced: false
            }
        },

        processhtml: {
            release: {
                files: [{
                    expand: true,
                    cwd: root,
                    src: 'index.html',
                    dest: dest
                }]
            }
        }
    });

    // load the plugins
grunt.loadNpmTasks( 'grunt-contrib-copy' );
grunt.loadNpmTasks( 'grunt-ts' );
grunt.loadNpmTasks( 'grunt-contrib-uglify' );
grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
grunt.loadNpmTasks( 'grunt-contrib-clean' );
grunt.loadNpmTasks( 'grunt-processhtml' );

    // tasks
grunt.registerTask( 'default', [ 'clean:previousBuild', 'ts', 'copy', 'uglify', 'cssmin', 'processhtml', 'clean:afterBuild' ] );
};
