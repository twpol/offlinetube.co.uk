require.config({
	paths: {
		library: '../../bower_components'
	},
	shim: {
		'library/angular/angular': {
			exports: 'angular'
		},
		'library/angular-route/angular-route': ['library/angular/angular'],
		'library/angulartics/dist/angulartics.min': ['library/angular/angular'],
		'library/angulartics/dist/angulartics-ga.min': ['library/angular/angular'],
		'library/angulartics/dist/angulartics-piwik.min': ['library/angular/angular'],
		'templates': ['library/angular/angular']
	}
});
/* jshint unused: false */
define([
	'app'
], function () {
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