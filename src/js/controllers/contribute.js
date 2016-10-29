define([
	'library/lodash/lodash',
	'data/index'
], function (_, data) {
	return ['$scope', '$http', function ($scope, $http) {
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
		$scope.upload = function () {
			$scope.uploading = true;
			$scope.uploadingProgress = '0%';

			var keys = _.map($scope.records, function (record) {
					return 'record-' + record.journey.key;
				}), keyIndex = 0, success = 0;

			var uploadNext = function () {
				var key = keys[keyIndex++];
				$scope.uploadingProgress = Math.floor(100 * keyIndex / keys.length) + '%';
				if (key) {
					$http({
						method: 'POST',
						url: '/api/upload.pl',
						params: {
							key: key
						},
						data: localStorage[key]
					}).then(function () {
						success++;
						uploadNext();
					}, function () {
						uploadNext();
					});
				} else {
					$scope.uploading = false;
					alert('Uploaded ' + success + ' of ' + keys.length + ' records successfully.');
				}
			};

			uploadNext();
		};
	}];
});