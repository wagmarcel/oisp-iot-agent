module.exports = function(grunt) {
    // Project configuration.
    var buildID = grunt.option('buildID') || 'local';
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        dirs: {
            jshint: 'buildscripts/jshint',
            jsfiles: ['Gruntfile.js',
                      'agent.js',
                      'device-id.js',
                      'device-info.js',
                      'lib/**/*.js',
                      'listeners/**/*.js']
        },
        jshint: {
			options: {
				jshintrc: '<%= dirs.jshint %>/config.json',
				ignores: ['lib/deprected/*.js']
			},
			local: {
				src: ['<%= dirs.jsfiles %>'],
				options: {
					force: true
				}
			},
			teamcity: {
				src: ['<%= dirs.jsfiles %>'],
				options: {
					force: true,
					reporter: require('jshint-teamcity')
				}
			}
		},
        compress: {
            teamcity: {
                options: {
                    archive: 'dist/'+'<%= pkg.name %>_' + buildID + ".tgz",
                    mode: 'tgz'
                },
                files: [{cwd: '.',
                        expand: true,
                         src: ['**/*.js', '**/*.sh', 'config.json', '!node_modules/**', '!dist/**', '!test/**', '!Gruntfile.js'],
                        /* this is the root folder of untar file */
                         dest: '<%= pkg.name %>/'
                        }
                    ]
                }
            },
        mocha_istanbul: {
             teamcity: {
                src: 'test/', // the folder, not the files
                options: {
                    ui: 'bdd',
                    coverage: true,
                    recursive: true,
                    reporter: 'mocha-teamcity-reporter',
                    mask: '*Tests.js',
                    /*check: {
                        lines: 70,
                        statements: 70,
                        function: 70
                    },*/
                    root: '.', // define where the cover task should consider the root of libraries that are covered by tests
                    coverageFolder: 'dist/coverage/nodejs',
                    reportFormats: ['lcov', 'teamcity']
                }
            }
        }
    });

    grunt.event.on('coverage', function(lcovFileContents, done){
        // Check below
        done();
    });

    grunt.loadNpmTasks('grunt-mocha-istanbul');

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-compress');

    // Default task(s).
    grunt.registerTask('default', ['jshint:dev', 'simplemocha:dev']);

    grunt.registerTask('teamcity_codevalidation', ['jshint:teamcity',
                                                   'mocha_istanbul:teamcity']);
    grunt.registerTask('packaging', ['compress:teamcity']);
};
