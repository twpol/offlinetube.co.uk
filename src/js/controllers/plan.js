define([
	'library/lodash/lodash',
	'data/index',
	'find-path'
], function (_, data, findPath) {
	return ['$scope', '$routeParams', '$location', function ($scope, $routeParams, $location) {
		$scope.network = _.first(data, { key: $routeParams.network });
		$scope.stations = _.values($scope.network.stations);
		$scope.title = 'Plan a route'; // I don't like this
		if ($routeParams.from || $routeParams.to) {
			$scope.from = $scope.network.stations[$routeParams.from];
			$scope.to = $scope.network.stations[$routeParams.to];
			if ($scope.from && $scope.to) {
				$scope.title = $scope.from.name + ' to ' + $scope.to.name; // I don't like this
			}

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
					north: 'N',
					south: 'S',
					east: 'E',
					west: 'W',
					clockwise: 'CW',
					anticlockwise: 'CCW'
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
								routes: _.uniqBy(_.map(segment, function (route) {
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
											directionKey: $scope.network.routes[route].toDirection,
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
										directionKey: $scope.network.routes[route].fromDirection,
										direction: directions[$scope.network.routes[route].fromDirection],
										directionShort: directionsShort[$scope.network.routes[route].fromDirection],
										to: $scope.network.routes[route].fromViaName,
										stops: fromIndex - toIndex
									};
								}), 'to')
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
		$scope.switchDirection = function () {
			var temp = $scope.from;
			$scope.from = $scope.to;
			$scope.to = temp;
		};
		$scope.$watchGroup(['from', 'to'], function () {
			if ($scope.from && $scope.to) {
				$location.url('?from=' + $scope.from.key + '&to=' + $scope.to.key);
			} else if ($scope.from) {
				$location.url('?from=' + $scope.from.key);
			} else if ($scope.to) {
				$location.url('?to=' + $scope.to.key);
			} else {
				$location.url('/network/' + $scope.network.key + '/plan'); // Not sure this can happen.
			}
		});
	}];
});