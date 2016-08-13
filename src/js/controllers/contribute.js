define([
	'library/lodash/lodash',
	'data/index'
], function (_, data) {
	return ['$scope', function ($scope) {
		$scope.contributor = !!localStorage.contributor;
		// Estimated assuming ~5MB of storage available.
		var charactersStored = JSON.stringify(localStorage).length;
		$scope.storageUsedKB = (charactersStored * 2 / 1024).toFixed(1);
		$scope.storageUsedPC = (charactersStored * 200 / 5242880).toFixed(1);
		$scope.records = _(localStorage).keys().filter(function (key) {
			return /^record-\d{13,}-\d+$/.test(key);
		}).map(function (key) {
			var record = JSON.parse(localStorage[key]);
			var network = _.find(data, { key: record.journey.network });
			record.journey.time = Number(key.split('-')[1]);
			record.journey.from = _.find(network.stations, { key: _.first(record.journey.segments) });
			record.journey.to = _.find(network.stations, { key: _.last(record.journey.segments) });
			return record;
		}).value();
		$scope.setContributor = function (enabled) {
			localStorage.contributor = enabled ? '1' : '';
			$scope.contributor = enabled;
		};
	}];
});