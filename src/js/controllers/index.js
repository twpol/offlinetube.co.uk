define([
	'library/lodash/lodash',
	'data/index'
], function (_, data) {
	return ['$scope', function ($scope) {
		$scope.contributor = !!localStorage.contributor;
		$scope.networks = data;
	}];
});