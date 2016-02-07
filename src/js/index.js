require.config({
	paths: {
		library: '../bower_components'
	}
});
/* jshint unused: false */
define([
	'library/lodash/lodash',
	'data/index',
	'find-path',
	'app'
], function (_, networks, findPath) {
	window.addEventListener('message', function (event) {
		if (event.origin === location.origin) {
			if (event.data === 'application-cache-update-ready') {
				event.source.applicationCache.swapCache();
				location.reload();
			}
		}
	});
});
require('index');