module.exports = function (grunt) {
	'use strict';
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		files: {
			grunt: ['Gruntfile.js'],
			// For development and live
			data: ['js/data/*/*/**/*.js'],
			jade: ['html/jade/*.jade'],
			template: ['html/*.html'],
			less: ['css/less/index.less'],
			// For live
			js: ['js/**/*.js'],
			css: ['css/index.css'],
			png: ['png/*.png'],
			svg: ['svg/*.svg'],
			html: ['*.html'],
			manifest: ['index.*']
		},
		connect: {
			dev: {
				options: {
					port: 8001,
					useAvailablePort: true,
					base: '.',
					middleware: function (connect, options, middlewares) {
						middlewares.unshift(function (req, res, next) {
							if (!/\./.test(req.url)) {
								req.url = '/src/index-dev.html';
							}
							return next();
						});
						return middlewares;
					},
					keepalive: true,
					livereload: 35729,
					open: true
				}
			},
			live: {
				options: {
					port: 8002,
					useAvailablePort: true,
					base: '.',
					middleware: function (connect, options, middlewares) {
						middlewares.unshift(function (req, res, next) {
							if (!/\./.test(req.url)) {
								req.url = '/index.html';
							}
							return next();
						});
						return middlewares;
					},
					keepalive: true,
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
				tasks: ['jshint:grunt', 'build:dev']
			},
			data: {
				files: 'src/<%= files.data %>',
				tasks: ['build:data']
			},
			jade: {
				files: 'src/<%= files.jade %>',
				tasks: ['build:jade', 'build:template']
			},
			less: {
				files: 'src/<%= files.less %>',
				tasks: ['build:less']
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
				files: {
					cwd: 'src',
					src: '<%= files.js %>'
				}
			}
		},
		execute: {
			data: {
				src: 'src/js/build/data.js'
			}
		},
		jade: {
			jade: {
				expand: true,
				flatten: true,
				src: 'src/<%= files.jade %>',
				dest: 'src/html',
				ext: '.html'
			}
		},
		less: {
			less: {
				src: 'src/<%= files.less %>',
				dest: 'src/css/index.css'
			}
		},
		html2js: {
			template: {
				src: 'src/<%= files.template %>',
				dest: 'src/js/templates.js'
			}
		},
		requirejs: {
			js: {
				options: {
					optimize: 'uglify2',
					generateSourceMaps: true,
					preserveLicenseComments: false,
					baseUrl: 'src/js',
					mainConfigFile: 'src/js/index.js',
					name: '../../bower_components/almond/almond',
					include: ['index'],
					wrap: {
						start: '',
						end: 'require("index")'
					},
					out: 'index.js'
				}
			}
		},
		copy: {
			options: {
				timestamp: true
			},
			css: {
				expand: true,
				cwd: 'src',
				src: '<%= files.css %>',
				dest: '.'
			},
			png: {
				expand: true,
				cwd: 'src',
				src: '<%= files.png %>',
				dest: '.'
			},
			svg: {
				expand: true,
				cwd: 'src',
				src: '<%= files.svg %>',
				dest: '.'
			},
			html: {
				expand: true,
				flatten: true,
				cwd: 'src',
				src: '<%= files.html %>',
				dest: '.'
			}
		},
		manifest: {
			manifest: {
				options: {
					basePath: '.',
					network: ['ws://localhost:35729', '//www.google-analytics.com', '//stats.offlinetube.co.uk'],
					fallback: ['/ /index.html']
				},
				src: ['index.html', 'index.js', 'css/*', 'svg/*', 'appcache.html'],
				dest: 'appcache.manifest'
			}
		},
		clean: {
			dev: {
				src: ['src/html/*.html', 'src/css/index.css', 'src/js/data/*/*.js']
			},
			live: {
				src: ['src/js/templates.js', 'css', 'png', 'svg', '*.html', 'index.*', 'appcache.*']
			}
		}
	});
	require('load-grunt-tasks')(grunt);
	// For dev
	grunt.registerTask('build:data', ['execute:data']);
	grunt.registerTask('build:jade', ['jade:jade']);
	grunt.registerTask('build:template', ['html2js:template']);
	grunt.registerTask('build:less', ['less:less']);
	grunt.registerTask('build:dev', ['build:data', 'build:jade', 'build:template', 'build:less']);
	// For live
	grunt.registerTask('build:js', ['jshint:js', 'requirejs:js']);
	grunt.registerTask('build:css', ['copy:css']);
	grunt.registerTask('build:png', ['copy:png']);
	grunt.registerTask('build:svg', ['copy:svg']);
	grunt.registerTask('build:html', ['copy:html']);
	grunt.registerTask('build:manifest', ['manifest:manifest']);
	grunt.registerTask('build:live', ['build:js', 'build:css', 'build:png', 'build:svg', 'build:html', 'build:manifest']);
	// General
	grunt.registerTask('build', ['build:dev', 'build:live']);
	grunt.registerTask('default', ['watch']);
};