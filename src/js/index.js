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
	
//	var network = _.first(networks, {name: 'London Underground'});
//	var station1 = network.stations['colliers-wood'];
//	var station2 = network.stations.waterloo;

//	var paths = findPath(network, station1, station2);
//
//	_.forEach(paths, function (path, index) {
//		var station = null;
//		_.forEach(path, function (segment) {
//			if (_.isArray(segment)) {
//				console.log('Route ' + (index + 1) + ': At ' + station.name + ' board ' + _.map(segment, function (route) {
//					return network.lines[network.routes[route].line].name + ' to ' + network.routes[route].name;
//				}).join(' or '));
//			} else {
//				station = network.stations[segment];
//			}
//		});
//		console.log('Route ' + (index + 1) + ': Arrive at ' + station.name);
//	});
//
//	var findLinks = function (station, from, to) {
//		return _.chain(station.links)
//			.filter(function (link) {
//				return (_.contains(link.from, from) && _.contains(link.to, to)) ||
//					(_.contains(link.a, from) && _.contains(link.b, to)) ||
//					(_.contains(link.b, from) && _.contains(link.a, to));
//			})
//			.pluck('at')
//			.flatten()
//			.unique()
//			.sort()
//			.value();
//	};
});
require('index');