define([
	'library/lodash/lodash'
], function (_) {
	// Returns:
	//   array of paths
	//     array of segments
	//       station name
	//       array of routes
	//       station name
	//       ...
	return function (network, station1, station2) {
		console.info('Finding path from %s to %s', station1.name, station2.name);

		var route = function (route) {
			return network.routes[route];
		};

		var station = function (station) {
			return network.stations[station];
		};

		var makePath = function (items) {
			var segments = [], lineSegments = [];
			_.forEach(items, function (item, index) {
				lineSegments.push(index % 2 === 0 ? item.key : item.line);
				segments.push(item.key);
			});
			return {
				key: lineSegments.join(','),
				segments: segments
			};
		};

		var normalisePaths = function (paths) {
			return _(paths)
				.groupBy('key')
				.values()
				.map(function (pathGroup) {
					return _.zip.apply(_, _.map(pathGroup, 'segments'));
				})
				.map(function (path) {
					return _.map(path, function (segment, index) {
						return index % 2 === 0 ? segment[0] : _.uniq(segment);
					});
				})
				.value();
		};

		console.time('find-path');
		var paths = [];
		_(station1.routes)
			.map(route)
			.forEach(function (routeA) {
				if (_.includes(station2.routes, routeA.key)) {
					paths.push(makePath([station1, routeA, station2]));
				}
				_(routeA.stations)
					.map(station)
					.filter('interchange')
					.reject(station1)
					.reject(station2)
					.forEach(function (stationA) {
						_(stationA.routes)
							.map(route)
							.forEach(function (routeB) {
								if (_.includes(station2.routes, routeB.key)) {
									paths.push(makePath([station1, routeA, stationA, routeB, station2]));
								}
								_(routeB.stations)
									.map(station)
									.filter('interchange')
									.reject(station1)
									.reject(stationA)
									.reject(station2)
									.forEach(function (stationB) {
										_(stationB.routes)
											.map(route)
											.forEach(function (routeC) {
												if (_.includes(station2.routes, routeC.key)) {
													paths.push(makePath([station1, routeA, stationA, routeB, stationB, routeC, station2]));
												}
											})
											.value();
									})
									.value();
							})
							.value();
					})
					.value();
			})
			.value();
		// console.log(JSON.stringify(paths, null, 2));
		console.timeEnd('find-path');

		console.time('find-path-normalise');
		paths = _(paths)
			.thru(normalisePaths)
			.value();
		console.timeEnd('find-path-normalise');

		// _.forEach(paths, function (path) {
		// 	console.log('  ' + _.map(path, function (segment) {
		// 		if (_.isArray(segment)) {
		// 			return segment.join('/');
		// 		}
		// 		return network.stations[segment].name;
		// 	}).join(' --> '));
		// });

		return paths;
	};
});