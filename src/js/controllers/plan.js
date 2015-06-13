define([
	'library/lodash/lodash',
	'data/index',
	'find-path'
], function (_, data, findPath) {
	return ['$scope', '$routeParams', '$sce', function ($scope, $routeParams, $sce) {
		$scope.network = _.first(data, {key: $routeParams.network});
		$scope.stations = _.values($scope.network.stations);
		$scope.planUrl = $sce.trustAsResourceUrl('/network/' + $scope.network.key + '/plan');
		if ($routeParams.from || $routeParams.to) {
			$scope.from = $scope.network.stations[$routeParams.from];
			$scope.to = $scope.network.stations[$routeParams.to];
			
			if ($routeParams.from && $routeParams.to) {
				var directions = {
					north: 'northbound',
					south: 'southbound',
					east: 'eastbound',
					west: 'westbound',
					clockwise: 'clockwise',
					anticlockwise: 'anti-clockwise'
				};
				var directionsShort = {
					north: '\u2191',
					south: '\u2193',
					east: '\u2192',
					west: '\u2190',
					clockwise: '\u27F3',
					anticlockwise: '\u27F2'
				};
				
				var paths = findPath($scope.network, $scope.from, $scope.to);
				$scope.paths = _.map(paths, function (path) {
					var rv = {
						segments: [],
						stops: [0, 0],
						changes: (path.length - 3) / 2,
						station: $scope.network.stations[_.last(path)].name
					};
					_.forEach(path, function (segment, segmentIndex) {
						if (_.isArray(segment)) {
							var segmentStops = [1000, 0];
							rv.segments.push({
								station: $scope.network.stations[path[segmentIndex - 1]].name,
								routes: _.map(segment, function (route) {
									var fromIndex = $scope.network.routes[route].stations.indexOf(path[segmentIndex - 1]);
									var toIndex = $scope.network.routes[route].stations.indexOf(path[segmentIndex + 1]);
									var stops = Math.abs(fromIndex - toIndex);
									segmentStops[0] = Math.min(segmentStops[0], stops);
									segmentStops[1] = Math.max(segmentStops[1], stops);
									if (fromIndex < toIndex) {
										return {
											line: $scope.network.lines[$scope.network.routes[route].line].name,
											color: $scope.network.lines[$scope.network.routes[route].line].color,
											textColor: $scope.network.lines[$scope.network.routes[route].line].textColor,
											direction: directions[$scope.network.routes[route].toDirection],
											directionShort: directionsShort[$scope.network.routes[route].toDirection],
											to: $scope.network.routes[route].toViaName,
											stops: toIndex - fromIndex
										};
									}
									return {
										line: $scope.network.lines[$scope.network.routes[route].line].name,
										color: $scope.network.lines[$scope.network.routes[route].line].color,
										textColor: $scope.network.lines[$scope.network.routes[route].line].textColor,
										direction: directions[$scope.network.routes[route].fromDirection],
										directionShort: directionsShort[$scope.network.routes[route].fromDirection],
										to: $scope.network.routes[route].fromViaName,
										stops: fromIndex - toIndex
									};
								})
							});
							rv.stops[0] += segmentStops[0];
							rv.stops[1] += segmentStops[1];
						}
					});
					// 4 minutes to enter station (1), wait for train (2), exit station (1)
					// 2 minutes per stop
					// 4 minutes to interchange (2) and wait for train (2)
					rv.minutes = 4 + rv.stops[0] * 2 + rv.changes * 4;
					return rv;
				});
			}
		}
	}];
});