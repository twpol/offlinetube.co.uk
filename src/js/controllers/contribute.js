define([
], function () {
	return ['$scope', function ($scope) {
		$scope.contributor = !!localStorage.contributor;
		$scope.setContributor = function (enabled) {
			localStorage.contributor = enabled ? '1' : '';
			$scope.contributor = enabled;
		};
	}];
});