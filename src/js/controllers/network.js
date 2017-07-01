define([
	'library/lodash/lodash',
	'data/index'
], function (_, data) {
	return ['$scope', '$routeParams', function ($scope, $routeParams) {
		$scope.contributor = !!localStorage.contributor;
		$scope.network = _.find(data, { key: $routeParams.network });
		$scope.lines = $scope.network.lines;
		$scope.stations = $scope.network.stations;
	}];
});