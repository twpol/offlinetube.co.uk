define([
	'library/lodash/lodash'
], function (_) {
	return function (network, station1, station2) {
		console.log('Finding path from %s to %s', station1.name, station2.name);
		console.time('find-path');
		
		// TODO: Filter routes based on direction?
		var directRoutes = _.intersection(station1.routes, station2.routes);
		var station1IndirectRoutes = _.difference(station1.routes, directRoutes);
		var station2IndirectRoutes = _.difference(station2.routes, directRoutes);
		
		// Look for any direct paths first.
		var direct = _(directRoutes)
			.groupBy(function (route) { return network.routes[route].line; })
			.values()
			.map(function (routes) {
				return [station1.key, routes, station2.key];
			})
			.value();
			
		// Now let's look for 1-change routes.
		//   This works by finding all stations that are connected to both stations where at least one of the two halfs
		//   is connected via a NON-direct route (i.e. a route not found above).
		var indirect1 = _(network.stations)
			.filter(function (station) {
				return station !== station1 && station !== station2 &&
					(_.intersection(station.routes, station1IndirectRoutes).length && _.intersection(station.routes, station2.routes).length ||
					_.intersection(station.routes, station2IndirectRoutes).length && _.intersection(station.routes, station1.routes).length);
			})
			.map(function (interchange) {
				// Construct the indirect data: start, routes, interchange, routes, end.
				var segment1Routes = _.intersection(station1.routes, interchange.routes);
				var segment2Routes = _.intersection(station2.routes, interchange.routes);
				return [
					station1.key,
					segment1Routes,
					interchange.key,
					_.difference(segment2Routes, segment1Routes),
					station2.key
				];
			}).filter(function (indirectRoute) {
				// Filter out any calculated interchanges where the possible routes are empty (due to being the same on both legs).
				return indirectRoute[1].length > 0 && indirectRoute[3].length > 0;
			})
			.value();
		
		// Now let's look for 2-change routes.
		//   This works by finding all routes which have intersections with the routes from the two stations.
		// Start with all stations on all routes from the two stations.
//		var stations2 = _(network.stations)
//			.filter(function (station) {
//				return station !== station1 && station !== station2 &&
//					(_.intersection(station.routes, station1.routes).length || _.intersection(station.routes, station2.routes).length);
//			})
//			.value();
//		debugger;
//		var interchanges2 = _.filter(network.stations, function (station) {
//			// This will find all possible stations we can change at.
//			return station !== station1 && station !== station2 &&
//				(_.intersection(station.routes, station1IndirectRoutes).length && !_.intersection(station.routes, station2.routes).length ||
//				_.intersection(station.routes, station2IndirectRoutes).length && !_.intersection(station.routes, station1.routes).length);
//		});
//		var indirect2 = _.filter(_.map(interchanges2, function (interchange) {
//			// Construct the indirect data: start, routes, interchange, routes, end.
//			return [
//				station1.key,
//				_.intersection(station1.routes, interchange.routes),
//				interchange.key,
//				_.difference(_.intersection(interchange.routes, station2.routes), _.intersection(station1.routes, interchange.routes)),
//				station2.key
//			];
//		}), function (indirectRoute) {
//			// Filter out any calculated interchanges where the possible routes are empty (due to being the same on both legs).
//			return indirectRoute[1].length > 0 && indirectRoute[3].length > 0;
//		});
//		console.log('  Interchanges-2 %d --> indirect-2 routes %d', interchanges2.length, indirect2.length);
		
		// TODO
		
		var paths = [].concat(direct, indirect1);
		console.timeEnd('find-path');
		_.forEach(paths, function (path) {
			console.log('  ' + _.map(path, function (segment) {
				if (_.isArray(segment)) {
					return segment.join('/');
				}
				return network.stations[segment].name;
			}).join(' --> '));
		});
		return paths;
	};
});