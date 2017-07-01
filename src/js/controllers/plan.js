define([
	'library/lodash/lodash',
	'data/index',
	'find-path'
], function (_, data, findPath) {
	return ['$scope', '$routeParams', '$location', function ($scope, $routeParams, $location) {
		$scope.contributor = !!localStorage.contributor;
		$scope.routeLimit = $scope.contributor ? 100 : 10;
		$scope.network = _.find(data, { key: $routeParams.network });
		$scope.stations = $scope.network.stations;
		$scope.title = 'Plan a route'; // I don't like this
		if ($routeParams.from || $routeParams.to) {
			$scope.from = _.find($scope.network.stations, { key: $routeParams.from });
			$scope.to = _.find($scope.network.stations, { key: $routeParams.to });
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
				var journeyKey = Date.now();
				$scope.paths = _.map(paths, function (path, pathIndex) {
					var rv = {
						segments: [],
						journey: {
							key: [journeyKey, pathIndex + 1].join('-'),
							network: $scope.network.key,
							segments: path
						},
						stops: [0, 0],
						time: [0, 0],
						changes: (path.length - 3) / 2,
						station: _.find($scope.network.stations, { key: _.last(path) }).name
					};
					_.forEach(path, function (segment, segmentIndex) {
						if (_.isArray(segment)) {
							var segmentStops = [1000, 0];
							var segmentTime = [1000, 0];
							rv.segments.push({
								station: _.find($scope.network.stations, { key: path[segmentIndex - 1] }).name,
								routes: _.uniqBy(_.map(segment, function (routeKey) {
									var route = _.find($scope.network.routes, { key: routeKey });
									var fromIndex = route.stations.indexOf(_.find($scope.network.stations, { key: path[segmentIndex - 1] }).index);
									var toIndex = route.stations.indexOf(_.find($scope.network.stations, { key: path[segmentIndex + 1] }).index);
									var stops = Math.abs(fromIndex - toIndex);
									var stopMin = Math.min(fromIndex, toIndex);
									var stopMax = Math.max(fromIndex, toIndex);
									var time = _.reduce(route.journeyTimes.slice(stopMin, stopMax), function (sum, time) {
										return sum + time;
									}, 0);
									segmentStops[0] = Math.min(segmentStops[0], stops);
									segmentStops[1] = Math.max(segmentStops[1], stops);
									segmentTime[0] = Math.min(segmentTime[0], time);
									segmentTime[1] = Math.max(segmentTime[1], time);
									if (fromIndex < toIndex) {
										return {
											line: $scope.network.lines[route.line].name,
											color: $scope.network.lines[route.line].color,
											textColor: $scope.network.lines[route.line].textColor,
											directionKey: route.toDirection,
											direction: directions[route.toDirection],
											directionShort: directionsShort[route.toDirection],
											to: route.toViaName,
											stops: toIndex - fromIndex
										};
									}
									return {
										line: $scope.network.lines[route.line].name,
										color: $scope.network.lines[route.line].color,
										textColor: $scope.network.lines[route.line].textColor,
										directionKey: route.fromDirection,
										direction: directions[route.fromDirection],
										directionShort: directionsShort[route.fromDirection],
										to: route.fromViaName,
										stops: fromIndex - toIndex
									};
								}), 'to')
							});
							rv.stops[0] += segmentStops[0];
							rv.stops[1] += segmentStops[1];
							rv.time[0] += segmentTime[0];
							rv.time[1] += segmentTime[1];
						}
					});
					// 4 minutes to enter station (1), wait for train (2), exit station (1)
					// 2 minutes per stop
					// 4 minutes to interchange (2) and wait for train (2)
					rv.minutes = 4 + rv.time[0] + rv.changes * 4;
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