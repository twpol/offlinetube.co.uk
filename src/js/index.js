require.config({
	paths: {
		library: '../../bower_components',
		jquery: '../../bower_components/jquery/dist/jquery'
	},
	shim: {
		'library/angular/angular': {
			exports: 'angular'
		},
		'library/angular-route/angular-route': ['library/angular/angular'],
		'library/angulartics/dist/angulartics.min': ['library/angular/angular'],
		'library/angulartics/dist/angulartics-ga.min': ['library/angular/angular'],
		'library/angulartics/dist/angulartics-piwik.min': ['library/angular/angular'],
		'templates': ['library/angular/angular'],
		'jquery': {
			exports: 'jQuery'
		},
		'library/bootstrap/js/transition': ['jquery'],
		'library/bootstrap/js/collapse': ['jquery']
	}
});
define([
	'library/angular/angular',
	'app'
], function (angular) {
	angular.bootstrap(document, ['TubeApp']);

	window.addEventListener('message', function (event) {
		if (event.origin === location.origin) {
			if (event.data === 'application-cache-update-ready') {
				event.source.applicationCache.swapCache();
				location.reload();
			}
		}
	});
});