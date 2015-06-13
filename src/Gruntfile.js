module.exports = function (grunt) {
	'use strict';
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		files: {
			grunt: ['Gruntfile.js'],
			data: ['data/**/*.js'],
			template: ['html/**/*.tpl.html', 'html/**/*.jade'],
			js: ['js/**/*.js'],
			jsdata: ['js/data/**/*.js'],
			less: ['less/index.less'],
			html: ['html/*.html'],
			manifest: ['../index.*']
		},
		connect: {
			server: {
				options: {
					port: 8001,
					useAvailablePort: true,
					base: '..',
					middleware: function (connect, options, middlewares) {
						middlewares.unshift(function (req, res, next) {
							if (!/\./.test(req.url)) {
								req.url = '/';
							}
							return next();
						});
						return middlewares;
					},
					keepalive: true,
					livereload: 35729,
					open: true
				}
			}
		},
		watch: {
			options: {
				livereload: 35729
			},
			grunt: {
				files: '<%= files.grunt %>',
				tasks: ['jshint:grunt', 'build']
			},
			data: {
				files: '<%= files.data %>',
				tasks: ['build:data']
			},
			template: {
				files: '<%= files.template %>',
				tasks: ['build:template']
			},
			js: {
				files: '<%= files.js %>',
				tasks: ['build:js']
			},
			less: {
				files: '<%= files.less %>',
				tasks: ['build:less']
			},
			html: {
				files: '<%= files.html %>',
				tasks: ['build:html']
			},
			manifest: {
				files: '<%= files.manifest %>',
				tasks: ['build:manifest']
			}
		},
		jshint: {
			options: {
				// grunt-contrib-jshint
				force: true,
				// JSHint
				bitwise: true,
				curly: true,
				eqeqeq: true,
				es3: true,
				forin: true,
				freeze: true,
				funcscope: true,
				futurehostile: true,
				//globalstrict: true,
				iterator: true,
				latedef: true,
				noarg: true,
				nocomma: true,
				nonbsp: true,
				nonew: true,
				notypeof: true,
				shadow: true,
				singleGroups: true,
				undef: true,
				unused: true
			},
			grunt: {
				options: {
					node: true,
					globals: {
						require: true,
						module: true
					}
				},
				src: '<%= files.grunt %>'
			},
			js: {
				options: {
					browser: true,
					devel: true,
					globals: {
						define: true,
						require: true,
						angular: true
					}
				},
				src: '<%= files.js %>'
			}
		},
		execute: {
			data: {
				src: 'js/build/data.js'
			}
		},
		html2js: {
			template: {
				src: '<%= files.template %>',
				dest: 'js/templates.js'
			}
		},
		requirejs: {
			js: {
				options: {
					optimize: 'uglify2',
					generateSourceMaps: true,
					preserveLicenseComments: false,
					baseUrl: 'js',
					mainConfigFile: 'js/index.js',
					name: '../bower_components/almond/almond',
					include: ['index'],
					out: '../index.js'
				}
			}
		},
		less: {
			less: {
				src: '<%= files.less %>',
				dest: '../index.css'
			}
		},
		clean: {
			data: '<%= files.jsdata %>'
		},
		copy: {
			options: {
				timestamp: true
			},
			data: {
				expand: true,
				src: '<%= files.data %>',
				dest: 'js'
			},
			html: {
				expand: true,
				flatten: true,
				src: '<%= files.html %>',
				dest: '../'
			}
		},
		manifest: {
			manifest: {
				options: {
					basePath: '../',
					network: ['ws://localhost:35729', '//www.google-analytics.com', '//stats.offlinetube.co.uk'],
					fallback: ['/ /index.html']
				},
				src: ['index.*', 'appcache.html'],
				dest: '../appcache.manifest'
			}
		}
	});
	require('load-grunt-tasks')(grunt);
	grunt.registerTask('build:data', ['clean:data', 'copy:data', 'execute:data']);
	grunt.registerTask('build:template', ['html2js:template']);
	grunt.registerTask('build:js', ['jshint:js', 'requirejs:js']);
	grunt.registerTask('build:less', ['less:less']);
	grunt.registerTask('build:html', ['copy:html']);
	grunt.registerTask('build:manifest', ['manifest:manifest']);
	grunt.registerTask('build', ['copy:data', 'execute:data', 'html2js:template', 'jshint:js', 'requirejs:js', 'less:less', 'copy:html', 'manifest:manifest']);
	grunt.registerTask('default', ['watch']);
};