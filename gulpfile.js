'use strict';

var gulp = require( 'gulp' )
	, sequence = require( 'gulp-sequence' ).use( gulp )
	, eslint = require( 'gulp-eslint' )
	, uglify = require( 'gulp-uglify' )
	, sourcemaps = require( 'gulp-sourcemaps' )
	, babel = require( 'gulp-babel' )
	, concat = require( 'gulp-concat' )
	, glob = require( 'glob' )
	, brotli = require( 'gulp-brotli' )
	, browserSync = require( 'browser-sync' ).create()
	, inject = require( 'gulp-inject' )
	, injectString = require( 'gulp-inject-string' )
	, gulpif = require( 'gulp-if' )
	, gutil = require( 'gulp-util' )
	, del = require( 'del' )
	, css = require( 'gulp-clean-css' )
	, cssnano = require( 'gulp-cssnano' )
	, sass = require( 'gulp-sass' )
	, autoprefixer = require( 'gulp-autoprefixer' )
	, stylelint = require( 'gulp-stylelint' )
	, environments = require( 'gulp-environments' )
	, rev = require( 'gulp-rev' )
	, imagemin = require( 'gulp-imagemin' )
	, filter = require( 'gulp-filter' )
	, html = require( 'gulp-htmlmin' )
	, htmlhint = require( 'gulp-htmlhint' )
	, bower = require( 'gulp-main-bower-files' )
	, json = require( 'gulp-json-minify' )
	// Main Configurations
	, options = {
		directory: {
			source: 'src',
			dist: 'dist',
			git_pages: 'docs',
			assets: 'assets',
			tools: 'tools',
			sailsjs: '.tmp/public',
		},
		github: {
			name: 'mws-restaurant-stage-3',
		},
		service_worker: {
			generator: 'sw-generator.js',
			name: 'sw.js',
			toolbox_name: 'sw-toolbox.js',
		},
		browserSync: {
			port: 4000,
			server: {
				baseDir: '',
			},
			ui: false,
			ghostMode: false,
			logConnections: false,
			logSnippet: false,
			minify: false,
			timestamps: false,
			notify: true,
			localOnly: true,
			logLevel: 'silent',
		},
		// Other options
		clean: {
			force: true,
		},
		read: {
			read: false,
		},
		write: {
			overwrite: true,
		},
		babel: {
			minified: false,
		},
		css: {
			level: {
				2: {
					all: true,
				},
			},
		},
		cssnano: {
			autoprefixer: {
				add: false,
			},
		},
		sass: {
			outputStyle: 'expanded',
		},
		autoprefixer: {
			add: true,
		},
		stylelint: {
			reporters: [
				{
					formatter: 'string',
					console: false,
				}
			],
			fix: false,
			failAfterError: false,
			debug: false,
		},
		sourcemaps: {
			addComment: false,
		},
		uglify: {
			mangle: true,
			preserveComments: false,
			topLevel: true,
			compress: {
				drop_console: true,
				drop_debugger: true,
				passes: 2,
			},
			output: {
				max_line_len: 1200000,
			},
		},
		html: {
			removeAttributeQuotes: false,
			collapseWhitespace: true,
			removeComments: true,
			caseSensitive: true,
			minifyCSS: true,
			minifyJS: true,
		},
		imagemin: {
			plugins: [
				imagemin.gifsicle(
					{
						interlaced: true,
						optimizationLevel: 3,
					}
				),
				imagemin.jpegtran(
					{
						progressive: true,
					}
				),
				imagemin.optipng(
					{
						optimizationLevel: 7,
					}
				),
				imagemin.svgo(),
			],
			config: {
				verbose: false,
			},
		},
	}
	, development = environments.development
	, production = environments.production
	, staging = environments.make( 'staging' )
;

// Common files
options.other_files = [
	options.directory.source + '/*.ico',
	options.directory.source + '/*.png',
	options.directory.source + '/*.json',
	options.directory.source + '/*.xml',
	options.directory.source + '/*.txt',
	options.directory.source + '/*.yml',
	options.directory.source + '/*.txt',
	options.directory.source + '/.htaccess',
	options.directory.tools + '/' + options.service_worker.toolbox_name,
];

// Common Webserver
options.browserSync.server.baseDir = options.directory.dist;
options.service_worker.local_port = options.browserSync.port + 1000;

// Gulp Tasks
// CLEAN TASKS
gulp.task(
	'clean',
	function() {

		gutil.log( gutil.colors.white.bgMagenta( ' [ CLEAN : DIST ] ' ) );

		return del(
				[
					options.directory.dist,
				],
				options.clean
			)
			.catch( errorManager )
		;

	}
);
gulp.task(
	'clean:app:scripts',
	function() {

		gutil.log( gutil.colors.white.bgMagenta( ' [ Clean : App : Scripts ] ' ) );

		return del( options.directory.dist + '/app/scripts/app-*.js', options.clean )
			.catch( errorManager )
		;

	}
);
gulp.task(
	'clean:app:styles',
	function() {

		gutil.log( gutil.colors.white.bgMagenta( ' [ Clean : App : Styles ] ' ) );

		return del( options.directory.dist + '/app/styles/app-*.css', options.clean )
			.catch( errorManager )
		;

	}
);
gulp.task(
	'clean:vendor:bower',
	function() {

		gutil.log( gutil.colors.white.bgMagenta( ' [ Clean : Vendor : Bower ] ' ) );

		return del(
				[
					options.directory.dist + '/app/scripts/vendor-*.js',
					options.directory.dist + '/app/styles/vendor-*.css',
				],
				options.clean
			)
			.catch( errorManager )
		;

	}
);
gulp.task(
	'clean:vendor:themes',
	function() {

		gutil.log( gutil.colors.white.bgMagenta( ' [ Clean : Vendor : Themes ] ' ) );

		return del(
				[
					options.directory.dist + '/app/scripts/themes-*.js',
					options.directory.dist + '/app/styles/themes-*.css',
				],
				options.clean
			)
			.catch( errorManager )
		;

	}
);

// COPY TASKS
gulp.task(
	'copy:data',
	function() {

		gutil.log( gutil.colors.white.bgBlue( ' [ Copy : Data ] ' ) );

		return gulp
			.src( options.directory.source + '/data/**/*.json' )
			.pipe( json() )
			.on( 'error', errorManager )
			.pipe( gulp.dest( options.directory.dist + '/data' ), options.write )
		;

	}
);
gulp.task(
	'copy:assets:icons',
	function() {

		gutil.log( gutil.colors.white.bgBlue( ' [ Copy : Assets : Icons ] ' ) );

		return gulp
			.src( options.directory.source + '/' + options.directory.assets + '/icons/**/*.{png,jpg,gif,svg}' )
			.pipe( imagemin( options.imagemin.plugins, options.imagemin.config ) )
			.on( 'error', errorManager )
			.pipe( gulp.dest( options.directory.dist + '/' + options.directory.assets + '/icons' ), options.write )
		;

	}
);
gulp.task(
	'copy:assets:fonts',
	function() {

		gutil.log( gutil.colors.white.bgBlue( ' [ Copy : Assets : Fonts ] ' ) );

		return gulp
			.src( options.directory.source + '/' + options.directory.assets + '/fonts/**/*.*' )
			.pipe( gulp.dest( options.directory.dist + '/' + options.directory.assets + '/fonts' ), options.write )
		;

	}
);
gulp.task(
	'copy:assets:images',
	function() {

		gutil.log( gutil.colors.white.bgBlue( ' [ Copy : Assets : Images ] ' ) );

		return gulp
			.src( options.directory.source + '/' + options.directory.assets + '/images/**/*.{webp,png,jpg,jpeg,gif,svg,ico,bmp}' )
			.pipe( imagemin( options.imagemin.plugins, options.imagemin.config ) )
			.on( 'error', errorManager )
			.pipe( gulp.dest( options.directory.dist + '/' + options.directory.assets + '/images' ), options.write )
		;

	}
);
gulp.task(
	'copy:assets',
	function( done ) {

		sequence(
			[
				'copy:assets:fonts',
				'copy:assets:icons',
				'copy:assets:images',
			]
		)( done );

	}
);
gulp.task(
	'copy:requirements',
	function() {

		gutil.log( gutil.colors.white.bgBlue( ' [ Copy : Manifest ] ' ) );

		return gulp
			.src( options.other_files )
			.pipe( gulp.dest( options.directory.dist ), options.write )
		;

	}
);

// BUILD VENDOR TASKS
gulp.task(
	'vendor:bower',
	function() {

		gutil.log( gutil.colors.white.bgCyan( ' [ Build : Vendor : Bower ] ' ) );

		var filterJS = filter( '**/*.js', { restore: true } )
			, filterCSS = filter( '**/*.css', { restore: true } )
			, nameJS = development() ? 'vendor.js' : 'vendor.min.js'
			, nameCSS = development() ? 'vendor.css' : 'vendor.min.css'
		;

		return gulp
			.src( './bower.json' )
			.pipe( bower() )
			.pipe( filterJS )
			.pipe( gulpif( staging(), sourcemaps.init() ) )
			.pipe( gulpif( ! development(), uglify( options.uglify ) ) )
			.on( 'error', errorManager )
			.pipe( concat( nameJS ) )
			.pipe( rev() )
			.pipe( gulpif( staging(), sourcemaps.write( '.', options.sourcemaps ) ) )
			.pipe( gulp.dest( options.directory.dist + '/app/scripts' ) )
			.pipe( filterJS.restore )
			.pipe( filterCSS )
			.pipe( gulpif( staging(), sourcemaps.init() ) )
			.pipe( concat( nameCSS ) )
			.pipe( gulpif( ! development(), css( options.css ) ) )
			.on( 'error', errorManager )
			.pipe( rev() )
			.pipe( gulpif( staging(), sourcemaps.write( '.', options.sourcemaps ) ) )
			.pipe( gulp.dest( options.directory.dist + '/app/styles' ) )
			.pipe( filterCSS.restore )
		;

	}
);
gulp.task(
	'vendor:themes',
	function() {

		gutil.log( gutil.colors.white.bgCyan( ' [ Build : Vendor : Themes ] ' ) );

		var filterJS = filter( '**/*.js', { restore: true } )
			, filterCSS = filter( '**/*.css', { restore: true } )
			, nameJS = development() ? 'themes.js' : 'themes.min.js'
			, namecss = development() ? 'themes.css' : 'themes.min.css'
		;
		return gulp
			.src( options.directory.source + '/themes/**/*.*' )
			.pipe( filterJS )
			.pipe( gulpif( staging(), sourcemaps.init() ) )
			.on( 'error', errorManager )
			.pipe( gulpif( ! development(), uglify( options.uglify ) ) )
			.on( 'error', errorManager )
			.pipe( concat( nameJS ) )
			.on( 'error', errorManager )
			.pipe( rev() )
			.on( 'error', errorManager )
			.pipe( gulpif( ! production(), sourcemaps.write( '.', options.sourcemaps ) ) )
			.on( 'error', errorManager )
			.pipe( gulp.dest( options.directory.dist + '/app/scripts' ) )
			.pipe( filterJS.restore )
			.pipe( filterCSS )
			.pipe( gulpif( staging(), sourcemaps.init() ) )
			.on( 'error', errorManager )
			.pipe( concat( namecss ) )
			.pipe( gulpif( ! development(), css( options.css ) ) )
			.on( 'error', errorManager )
			.pipe( rev() )
			.on( 'error', errorManager )
			.pipe( gulpif( staging(), sourcemaps.write( '.', options.sourcemaps ) ) )
			.on( 'error', errorManager )
			.pipe( gulp.dest( options.directory.dist + '/app/styles' ) )
			.pipe( filterCSS.restore )
		;

	}
);

// SERVICE WORKER
gulp.task(
	'generate-service-worker',
	function() {

		var workbox = require( 'workbox-build' );

		return workbox
			.generateSW(
				{
					swDest: options.directory.dist + '/' + options.service_worker.name,
					importWorkboxFrom: 'local',
					importScripts: [
						options.service_worker.toolbox_name,
					],
					globDirectory: options.directory.dist + '/',
					globPatterns: [
						'**\/*.{html,js,css,json}',
						'**\/*.{webp,png,jpg,jpeg,svg,ico}',
					],
					globIgnores: [
						'**\/' + options.service_worker.name,
					],
					runtimeCaching: [
						{
							urlPattern: new RegExp( /.*\.css$/ ),
							handler: 'cacheFirst',
							options: {
								cacheName: 'styles-cache',
								expiration: {
									maxEntries: 10,
									maxAgeSeconds: 31536000,
								},
								cacheableResponse: {
									statuses: [
										0,
										200,
									],
								},
							},
						},
						{
							urlPattern: new RegExp( /.*\.(?:webp|png|jpg|jpeg|svg|ico|cur|bmp)$/ ),
							handler: 'cacheFirst',
							options: {
								cacheName: 'images-cache',
								expiration: {
									maxEntries: 60,
									maxAgeSeconds: 7 * 24 * 60 * 60, //-> One week cache
								},
								cacheableResponse: {
									statuses: [
										0,
										200,
									],
								},
							},
						},
						{
							urlPattern: new RegExp( /restaurant\.html.*/ ),
							handler: 'networkFirst',
							options: {
								cacheName: 'restaurant-pages',
								cacheableResponse: {
									statuses: [
										0,
										200,
									],
								},
							},
						},
						{
							urlPattern: new RegExp( /^http[s]?:\/\/localhost:1337\/restaurants[\/]?/ ),
							handler: 'networkFirst',
							options: {
								cacheName: 'restaurants-cache',
								expiration: {
									maxEntries: 10,
								},
								cacheableResponse: {
									statuses: [
										0,
										200,
									],
								},
							},
						},
						{
							urlPattern: new RegExp( /^http[s]?:\/\/localhost:1337\/restaurants\/[1,9]/ ),
							handler: 'networkFirst',
							options: {
								cacheName: 'restaurant-cache',
								expiration: {
									maxEntries: 10,
								},
								cacheableResponse: {
									statuses: [
										0,
										200,
									],
								},
							},
						},
						{
							urlPattern: new RegExp( /^https:\/\/(.*)\.(?:googleapis|gstatic)\.com\/(.*)/ ),
							handler: 'staleWhileRevalidate',
							options: {
								cacheName: 'googleapis-cache',
								expiration: {
									maxEntries: 30,
								},
								cacheableResponse: {
									statuses: [
										0,
										200,
									],
								},
							},
						},
						{
							urlPattern: new RegExp( /.*\.json$/ ),
							handler: 'cacheFirst',
							options: {
								cacheName: 'json-cache',
								expiration: {
									maxEntries: 10,
								},
								cacheableResponse: {
									statuses: [
										0,
										200,
									],
								},
							},
						},
					],
					templatedUrls: {
						'/': [ 'index.html' ],
						'restaurant.html?id': [ 'restaurant.html' ],
						'restaurant.html?id=': [ 'restaurant.html' ],
						'restaurant.html?id=1': [ 'restaurant.html' ],
						'restaurant.html?id=2': [ 'restaurant.html' ],
						'restaurant.html?id=3': [ 'restaurant.html' ],
						'restaurant.html?id=4': [ 'restaurant.html' ],
						'restaurant.html?id=5': [ 'restaurant.html' ],
						'restaurant.html?id=6': [ 'restaurant.html' ],
						'restaurant.html?id=7': [ 'restaurant.html' ],
						'restaurant.html?id=8': [ 'restaurant.html' ],
						'restaurant.html?id=9': [ 'restaurant.html' ],
						'restaurant.html?id=10': [ 'restaurant.html' ],
					},
					clientsClaim: true,
					skipWaiting: true,
				}
			)
			.then(
				function( response ) {

					// In case there are any warnings from workbox-build, log them.
					for( var warning of response.warnings )
						gutil.log( gutil.colors.yellow( warning.toString() ) );

					gutil.log( gutil.colors.green( 'Service worker generation completed.' ) );

					return response;

				}
			)
			.catch(
				function( error ) {

					gutil.log( gutil.colors.red( 'Service worker generation failed.', error.toString() ) );

					return error;

				}
			)
		;

	}
);
gulp.task(
	'generate-criticalcss',
	function() {

		var critical = require( 'critical' ).stream
			, css_files = glob.sync( options.directory.dist + '/app/styles/**/*.css', { silent: true } ) || []
		;

		return gulp
			.src( options.directory.dist + '/*.html' )
			.pipe(
				critical(
					{
						base: options.directory.dist + '/',
						folder: options.directory.dist + '/',
						inline: true,
						minify: true,
						extract: false,
						inlineImages: false,
						css: css_files,
						assetPaths: [
							options.directory.assets + '/',
						],
						dimensions: [
							{
								width: 412,
								height: 732,
							},
							{
								width: 900,
								height: 1300,
							},
						],
					}
				)
			)
			.on( 'error', errorManager )
			.pipe( gulp.dest( options.directory.dist ) )
		;

	}
);

// Compress
gulp.task(
	'compress:brotli',
	function() {

		gutil.log( gutil.colors.white.bgMagenta( ' [ Compress : Brotli ] ' ) );

		return gulp.src(
			[
				options.directory.dist + '/**/**/*.{html,js,css}',
				'!' + options.directory.dist + '/*.js',
			]
			)
			.pipe( brotli.compress() )
			.on( 'error', errorManager )
			.pipe( gulp.dest( options.directory.dist + '/' ) )
		;

	}
);

// BUILD APP TASKS
// Github Pages
gulp.task(
	'github:pages:clean',
	function() {

		gutil.log( gutil.colors.white.bgMagenta( ' [ Github Pages : Clean ] ' ) );

		return del( options.directory.git_pages, options.clean )
			.catch( errorManager )
		;

	}
);
gulp.task(
	'github:pages:copy',
	function() {

		gutil.log( gutil.colors.white.bgBlue( ' [ Github Pages : Docs ] ' ) );

		return gulp
			.src(
				[
					options.directory.dist + '/**/**/.*',
					options.directory.dist + '/**/**/*.*',
				]
			)
			.pipe( gulp.dest( options.directory.git_pages + '/' ), options.write )
		;

	}
);
gulp.task(
	'github:pages:replace',
	function() {

		gutil.log( gutil.colors.white.bgCyan( ' [ Github Pages : Replace ] ' ) );

		var replace_base = [
				'<base href="\/">',
				'<base href="\/' + options.github.name + '\/">',
			]
			, replace_canonical = [
				'<link rel="canonical" href="\/">',
				'<link rel="canonical" href="\/' + options.github.name + '\/">',
			]
			, replace_manifest = [
				'"start_url": "\/index.html"',
				'"start_url": "\/' + options.github.name + '\/index.html"',
			]
			, replace_sw = [
				'"\/",',
				'"\/' + options.github.name + '\/",',
			]
		;

		var filterHTML = filter( '**/*.html', { restore: true } )
			, filterManifest = filter( '**/*.json', { restore: true } )
			, filterSW = filter( '**/*.js', { restore: true } )
		;

		return gulp
			.src(
				[
					options.directory.dist + '/*.html',
					options.directory.dist + '/manifest.json',
					options.directory.dist + '/' + options.service_worker.name,
				]
			)
			.pipe( filterHTML )
			.pipe( injectString.replace( replace_base[ 0 ], replace_base[ 1 ] ) )
			.on( 'error', errorManager )
			.pipe( injectString.replace( replace_canonical[ 0 ], replace_canonical[ 1 ] ) )
			.on( 'error', errorManager )
			.pipe( filterHTML.restore )
			.pipe( filterManifest )
			.pipe( injectString.replace( replace_manifest[ 0 ], replace_manifest[ 1 ] ) )
			.on( 'error', errorManager )
			.pipe( filterManifest.restore )
			.pipe( filterSW )
			.pipe( injectString.replace( replace_sw[ 0 ], replace_sw[ 1 ] ) )
			.on( 'error', errorManager )
			.pipe( filterSW.restore )
			.pipe( gulp.dest( options.directory.git_pages + '/' ), options.write )
		;

	}
);

// SailsJs
gulp.task(
	'sailsjs:clean',
	function() {

		gutil.log( gutil.colors.white.bgMagenta( ' [ sailsjs : Clean ] ' ) );

		return del( options.directory.sailsjs, options.clean )
			.catch( errorManager )
		;

	}
);
gulp.task(
	'sailsjs:copy',
	function() {

		gutil.log( gutil.colors.white.bgBlue( ' [ sailsjs : Public ] ' ) );

		return gulp
			.src(
				[
					options.directory.dist + '/**/**/.*',
					options.directory.dist + '/**/**/*.*',
				]
			)
			.pipe( gulp.dest( options.directory.sailsjs + '/' ), options.write )
		;

	}
);

// Inject
gulp.task(
	'build:inject',
	function() {

		gutil.log( gutil.colors.white.bgCyan( ' [ Build : Inject ] ' ) );

		var injectable = gulp.src(
				[
					options.directory.dist + '/app/styles/vendor-*.css',
					options.directory.dist + '/app/styles/themes-*.css',
					options.directory.dist + '/app/styles/app-*.css',
					options.directory.dist + '/app/scripts/vendor-*.js',
					options.directory.dist + '/app/scripts/themes-*.js',
				],
				options.read
			)
			, injectableAsyncDefer = gulp.src( options.directory.dist + '/app/scripts/app-*.js', options.read )
			, injectablePreload = gulp.src(
				[
					options.directory.dist + '/app/scripts/vendor-*.js',
					options.directory.dist + '/app/scripts/themes-*.js',
					options.directory.dist + '/app/scripts/app-*.js',
				],
				options.read
			)
			, injectableSW = gulp.src( options.directory.tools + '/' + options.service_worker.generator )
				.pipe( eslint.format() )
				.pipe( babel( options.babel ) )
				.on( 'error', errorManager )
				.pipe( uglify( options.uglify ) )
				.on( 'error', errorManager )
			, injectablePerformance = gulp.src( options.directory.tools + '/performance.js' )
				.pipe( eslint.format() )
				.pipe( babel( options.babel ) )
				.on( 'error', errorManager )
				.pipe( uglify( options.uglify ) )
				.on( 'error', errorManager )
		;

		return gulp
			.src( options.directory.source + '/*.html' )
			.pipe(
				inject(
					injectable,
					{
						ignorePath: 'dist',
						addRootSlash: false,
					}
				)
			)
			.on( 'error', errorManager )
			.pipe(
				inject(
					injectablePreload,
					{
						ignorePath: 'dist',
						addRootSlash: false,
						starttag: '<!-- inject:preload:{{ext}} -->',
						transform: function( filepath ) {

							return '<link rel="preload" href="' + filepath + '" as="script" />';

						},
					}
				)
			)
			.on( 'error', errorManager )
			.pipe(
				inject(
					injectableAsyncDefer,
					{
						ignorePath: 'dist',
						addRootSlash: false,
						starttag: '<!-- inject:async:defer:{{ext}} -->',
						transform: function( filepath ) {

							return '<script src="' + filepath + '" async defer></script>';

						},
					}
				)
			)
			.on( 'error', errorManager )
			.pipe(
				gulpif(
					development(),
					inject(
						injectablePerformance,
						{
							starttag: '<!-- inject:performance:{{ext}} -->',
							transform: function( filepath, file ) {

								return '<script>' + file.contents.toString() + '</script>'
								;

							},
						}
					)
				)
			)
			.on( 'error', errorManager )
			.pipe(
				inject(
					injectableSW,
					{
						starttag: '<!-- inject:service-worker:{{ext}} -->',
						transform: function( filepath, file ) {

							return '<script>'
								+ file.contents.toString()
									.replace( '[SERVICE-WORKER-NAME]', options.service_worker.name )
									.replace( '[SERVICE-WORKER-EXCLUDED-PORT]', options.browserSync.port )
								+ '</script>'
							;

						},
					}
				)
			)
			.on( 'error', errorManager )
			.pipe( htmlhint() )
			.on( 'error', errorManager )
			.pipe( html( options.html ) )
			.on( 'error', errorManager )
			.pipe( gulp.dest( options.directory.dist + '/' ) )
		;

	}
);
gulp.task(
	'build:html',
	function() {

		gutil.log( gutil.colors.white.bgCyan( ' [ Build : Html ] ' ) );

		return gulp
			.src( options.directory.source + '/app/**/*.html' )
			.on( 'error', errorManager )
			.pipe( htmlhint() )
			.on( 'error', errorManager )
			.pipe( html( options.html ) )
			.on( 'error', errorManager )
			.pipe( gulp.dest( options.directory.dist + '/app' ) )
		;

	}
);
gulp.task(
	'build:scripts',
	function() {

		gutil.log( gutil.colors.white.bgCyan( ' [ Build : App : Scripts ] ' ) );

		var nameJS = development() ? 'app.js' : 'app.min.js';

		var scripts = [
			// FIXME: If you need Polyfills, uncomment this line.
			// './node_modules/babel-polyfill/dist/polyfill.js',
			options.directory.source + '/app/scripts/common/*.js',
			options.directory.source + '/app/scripts/pages/*.js',
		];

		return gulp
			.src( scripts )
			.pipe( eslint.format() )
			.pipe( gulpif( production(), eslint.failAfterError() ) )
			.pipe( gulpif( staging(), sourcemaps.init() ) )
			.pipe( babel( options.babel ) )
			.on( 'error', errorManager )
			.pipe( concat( nameJS ) )
			.pipe( gulpif( ! development(), uglify( options.uglify ) ) )
			.on( 'error', errorManager )
			.pipe( rev() )
			.pipe( gulpif( staging(), sourcemaps.write( '.', options.sourcemaps ) ) )
			.pipe( gulp.dest( options.directory.dist + '/app/scripts' ) )
		;

	}
);
gulp.task(
	'build:styles',
	function() {

		gutil.log( gutil.colors.white.bgCyan( ' [ Build : App : Styles ] ' ) );

		var filterCSS = filter( '**/*.css', { restore: true } )
			, filterSASS = filter( [ '**/*.scss', '**/*.sass' ], { restore: true } )
			, nameCSS = development() ? 'app.css' : 'app.min.css'
		;

		return gulp
			.src(
				[
					'./node_modules/modern-normalize/modern-normalize.css',
					options.directory.source + '/app/**/*.css',
					options.directory.source + '/app/**/*.sass',
					options.directory.source + '/app/**/*.scss',
				]
			)
			.pipe( filterCSS )
			.pipe( gulpif( staging(), sourcemaps.init() ) )
			.pipe( filterCSS.restore )
			.pipe( filterSASS )
			.pipe( sass( options.sass ) )
			.on( 'error', errorManager )
			.pipe( filterSASS.restore )
			.pipe( gulpif( ! development(), cssnano( options.cssnano ) ) )
			.on( 'error', errorManager )
			.pipe( gulpif( development(), autoprefixer( options.autoprefixer ) ) )
			.on( 'error', errorManager )
			.on( 'error', errorManager )
			.pipe( concat( nameCSS ) )
			.pipe( gulpif( ! production(), stylelint( options.stylelint ) ) )
			.pipe( rev() )
			.pipe( gulpif( staging(), sourcemaps.write( '.', options.sourcemaps ) ) )
			.pipe( gulp.dest( options.directory.dist + '/app/styles' ) )
		;

	}
);

// ENVIRONMENTS TASKS
gulp.task(
	'environment:development',
	function() {

		gutil.log( gutil.colors.white.bgRed( '                 ' ) );
		gutil.log( gutil.colors.white.bgRed( ' [ DEVELOPMENT ] ' ) );
		gutil.log( gutil.colors.white.bgRed( '                 ' ) );

		environments.current( development );

		return gulp;

	}
);
gulp.task(
	'environment:testing',
	function() {

		gutil.log( gutil.colors.white.bgYellow( '             ' ) );
		gutil.log( gutil.colors.white.bgYellow( ' [ TESTING ] ' ) );
		gutil.log( gutil.colors.white.bgYellow( '             ' ) );

		environments.current( staging );

		return gulp;

	}
);
gulp.task(
	'environment:staging',
	function() {

		gutil.log( gutil.colors.white.bgYellow( '             ' ) );
		gutil.log( gutil.colors.white.bgYellow( ' [ STAGING ] ' ) );
		gutil.log( gutil.colors.white.bgYellow( '             ' ) );

		environments.current( staging );

		return gulp;

	}
);
gulp.task(
	'environment:production',
	function() {

		gutil.log( gutil.colors.white.bgGreen( '                ' ) );
		gutil.log( gutil.colors.white.bgGreen( ' [ PRODUCTION ] ' ) );
		gutil.log( gutil.colors.white.bgGreen( '                ' ) );

		environments.current( production );

		return gulp;

	}
);

// SERVE || WATCH TASKS
function errorManager( error ) {

	if( typeof error === 'function' )
		error();
	else
		gutil.log( gutil.colors.red( error.toString() ) );

	this.emit( 'end' );

};
function reload( done ) {

	gutil.log( gutil.colors.gray( 'File edited: browser reload..' ) );

	browserSync.reload();

	if( done && typeof done === 'function' )
		done();

};
gulp.task(
	'serve',
	[
		'build:development',
	],
	function() {

		browserSync.init( options.browserSync );

		var sequenceJS = function() {

				sequence(
					'clean:app:scripts',
					'build:scripts',
					'build:inject'
				)( reload );

			}
			, sequenceCSS = function( ) {

				sequence(
					'clean:app:styles',
					'build:styles',
					'build:inject'
				)( reload );

			}
			, sequenceImages = function() {

				sequence( 'copy:assets' )( reload );

			}
			, sequenceHTML = function() {

				sequence( 'build:html' )( reload );

			}
			, sequenceINDEX = function() {

				sequence( 'build:inject' )( reload );

			}
			, sequenceASSETS = function() {

				sequence(
					'copy:requirements',
					'copy:data'
				)( reload );

			}
			, sequenceVendorTHEMES = function() {

				sequence(
					'clean:vendor:themes',
					'vendor:themes',
					'build:inject'
				)( reload );

			}
			, sequenceVendorBOWER = function() {

				sequence(
					'clean:vendor:bower',
					'vendor:bower',
					'build:inject'
				)( reload )

			}
		;

		// Watch files
		// Styles
		gulp.watch(
			[
				options.directory.source + '/app/**/*.css',
				options.directory.source + '/app/**/*.sass',
				options.directory.source + '/app/**/*.scss',
			],
			sequenceCSS
		);
		// Scripts
		gulp.watch(
			[
				options.directory.tools + '/performance.js',
				options.directory.source + '/app/**/*.js',
				options.directory.tools + '/' + options.service_worker.generator,
				'./.eslintignore',
				'./.eslintrc',
			],
			sequenceJS
		);
		// Html
		gulp.watch( options.directory.source + '/app/**/*.html', sequenceHTML );
		gulp.watch( options.directory.source + '/*.html', sequenceINDEX );
		// Vendor
		gulp.watch( options.directory.source + '/themes/**/*.*', sequenceVendorTHEMES );
		gulp.watch( './bower.json', sequenceVendorBOWER );
		// Assets
		options.other_files.push( options.directory.source + '/data/**/*.*' );
		gulp.watch( options.other_files, sequenceASSETS );
		// Images
		gulp.watch( options.directory.source + '/' + options.directory.assets + '/**/*.*', sequenceImages );

	}
);
gulp.task(
	'serve:staging',
	[
		'build:staging',
	],
	function() {

		browserSync.init( options.browserSync );

		var sequenceBuild = function() {

			sequence( 'build:staging' )( reload );

		};

		// Watch files
		// Styles
		gulp.watch(
			[
				options.directory.source + '/**/**/**/*.*',
				options.directory.tools + '/' + options.service_worker.generator,
				options.directory.tools + '/sw-toolbox.js',
			],
			sequenceBuild
		);

	}
);
gulp.task(
	'serve:production',
	[
		'build:nocompression',
	],
	function() {

		options.browserSync = Object.assign(
			{},
			options.browserSync,
			{
				port: options.service_worker.local_port,
			}
		);
		browserSync.init( options.browserSync );

		var sequenceBuild = function() {

			sequence( 'build:nocompression' )( reload );

		};

		// Watch files
		// Styles
		gulp.watch(
			[
				options.directory.source + '/**/**/**/*.*',
				options.directory.tools + '/' + options.service_worker.generator,
				options.directory.tools + '/sw-toolbox.js',
			],
			sequenceBuild
		);

	}
);
gulp.task(
	'view:production',
	[
		'build',
	],
	function() {

		var webserver = require( 'gulp-webserver' );

		return gulp
			.src( options.directory.dist + '/' )
			.pipe(
				webserver(
					{
						port: options.service_worker.local_port,
						open: true,
					}
				)
			)
		;

	}
);

// DEFAULT TASKS
gulp.task( 'clean:all', [ 'clean', 'github:pages:clean', 'sailsjs:clean' ] );
gulp.task( 'start', [ 'serve' ] );
gulp.task( 'watch', [ 'serve' ] );
gulp.task( 'dev', [ 'serve' ] );

gulp.task(
	'build:development',
	function( done ) {

		sequence( 'clean', 'environment:development', [ 'copy:requirements', 'copy:assets', 'copy:data' ], [ 'vendor:bower', 'vendor:themes' ], [ 'build:styles', 'build:scripts', 'build:html', ], 'build:inject' )( done );

	}
);
gulp.task(
	'build:testing',
	function( done ) {

		sequence( 'clean', 'environment:testing', [ 'copy:requirements', 'copy:assets', 'copy:data' ], [ 'vendor:bower', 'vendor:themes' ], [ 'build:styles', 'build:scripts', 'build:html', ], 'build:inject' )( done );

	}
);
gulp.task(
	'build:staging',
	function( done ) {

		sequence( 'clean', 'environment:staging', [ 'copy:requirements', 'copy:assets', 'copy:data' ], [ 'vendor:bower', 'vendor:themes' ], [ 'build:styles', 'build:scripts', 'build:html', ], 'build:inject' )( done );

	}
);
gulp.task(
	'build:nocompression',
	function( done ) {

		sequence( 'clean', 'environment:production', [ 'copy:requirements', 'copy:assets', 'copy:data' ], [ 'vendor:bower', 'vendor:themes' ], [ 'build:styles', 'build:scripts', 'build:html' ], 'build:inject', 'generate-criticalcss', 'generate-service-worker' )( done );

	}
);
gulp.task(
	'build',
	function( done ) {

		sequence( 'clean', 'environment:production', [ 'copy:requirements', 'copy:assets', 'copy:data' ], [ 'vendor:bower', 'vendor:themes' ], [ 'build:styles', 'build:scripts', 'build:html' ], 'build:inject', 'generate-criticalcss', 'generate-service-worker', 'compress:brotli' )( done );

	}
);
gulp.task( 'default', [ 'build' ] );

// Github Pages
gulp.task(
	'github:pages',
	[
		'build',
	],
	function( done ) {

		sequence( 'github:pages:clean', 'github:pages:copy', 'github:pages:replace' )( done );

	}
);

// Sailsjs
gulp.task(
	'sailsjs',
	[ 'build' ],
	function( done ) {

		sequence( 'sailsjs:clean', 'sailsjs:copy' )( done );

	}
);

// Exports Gulp if you use 'Gulp Devtools' in Chrome DevTools
module.exports = gulp;
