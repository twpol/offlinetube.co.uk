define([
	'library/lodash/lodash',
	'data/index'
], function (_, data) {
	return ['$scope', '$routeParams', function ($scope, $routeParams) {
		$scope.network = _.find(data, { key: $routeParams.network });

		var journey = JSON.parse($routeParams.journey);

		var stations = _.map(journey.segments, function (segment) {
			if (typeof segment === 'string') {
				return _.find($scope.network.stations, { key: segment });
			}
			return -1;
		});

		$scope.record = {
			journey: journey,
			segments: _.map(journey.segments, function (segment, segmentIndex) {
				if (typeof segment === 'string') {
					return {
						name: stations[segmentIndex].name
					};
				}
				return {
					routes: _.map(segment, function (routeKey) {
						var route = _.find($scope.network.routes, { key: routeKey }),
							fromIndex = _.indexOf(route.stations, stations[segmentIndex - 1].index),
							toIndex = _.indexOf(route.stations, stations[segmentIndex + 1].index),
							routeStations = fromIndex < toIndex ?
								route.stations.slice(fromIndex, toIndex + 1) :
								route.stations.slice(toIndex, fromIndex + 1).reverse();

						return {
							line: $scope.network.lines[route.line].name,
							name: fromIndex < toIndex ? route.toViaName : route.fromViaName,
							stations: _.map(routeStations, function (stationIndex) {
								return {
									name: $scope.network.stations[stationIndex].name
								};
							})
						};
					})
				};
			})
		};

		function d2(number) {
			return number < 10 ? '0' + number : '' + number;
		}

		$scope.setTime = function (station) {
			if (station.time && !confirm('Time for ' + station.name + ' already set to ' + station.time + '. Overwrite it?')) {
				return;
			}
			var date = new Date();
			station.time = d2(date.getHours()) + d2(date.getMinutes()) + d2(date.getSeconds());
		};

		var savedRecord = JSON.parse(localStorage['record-' + journey.key] || '{}');
		$scope.record = _.merge(savedRecord, $scope.record);
		$scope.$watch(function () {
			localStorage['record-' + journey.key] = JSON.stringify($scope.record);
		});

		$scope.from = _.find($scope.network.stations, { key: _.first(journey.segments) });
		$scope.to = _.find($scope.network.stations, { key: _.last(journey.segments) });
	}];
});