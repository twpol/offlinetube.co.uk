define([
	'library/lodash/lodash',
	'data/index'
], function (_, data) {
	return ['$scope', '$routeParams', function ($scope, $routeParams) {
		$scope.network = _.first(data, {key: $routeParams.network});
		$scope.lines = _.values($scope.network.lines);
		$scope.stations = _.values($scope.network.stations);
	}];
});