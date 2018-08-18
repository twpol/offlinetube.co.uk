/* eslint-env node */
/* eslint-disable no-console */
/* global Promise: false */
var _ = require('lodash'),
	fs = require('promised-io/fs');

var inputDir = 'src/data/';
var outputDirJson = 'src/json/data/';
var outputDirJs = 'src/js/data/';

fs.readdir(inputDir).then(function (networkKeys) {
	return Promise.all(networkKeys.filter(function (networkKey) {
		return /^\w+$/.test(networkKey);
	}).map(function (networkKey) {
		var networkInfo = require('../../../' + inputDir + networkKey + '/index');
		return Promise.all([fs.readdir(inputDir + networkKey + '/routes').then(function (routeKeys) {
			console.log('%s: Reading %d routes...', networkKey, routeKeys.length);
			return Promise.all(routeKeys.map(function (routeKey) {
				return fs.readFile(inputDir + networkKey + '/routes/' + routeKey, 'utf8').then(JSON.parse).then(function (route) {
					route.key = routeKey.replace(/\.json$/, '');
					return route;
				});
			}));
		}), fs.readdir(inputDir + networkKey + '/lines').then(function (lineKeys) {
			console.log('%s: Reading %d lines...', networkKey, lineKeys.length);
			return Promise.all(lineKeys.map(function (lineKey) {
				return fs.readFile(inputDir + networkKey + '/lines/' + lineKey, 'utf8').then(JSON.parse).then(function (line) {
					line.key = lineKey.replace(/\.json$/, '');
					return line;
				});
			}));
		})]).then(function (data) {
			var routes = data[0];
			var lines = data[1];

			console.log('%s: Processing %d routes on %d lines...', networkKey, routes.length, lines.length);

			var stationKeys = _(routes).map('stations').flatten().sort().uniq().value();
			// console.log(stationNames);

			var stationKeyToIndex = _(stationKeys).map(function (stationKey, stationIndex) {
				return [stationKey, stationIndex];
			}).fromPairs().value();
			// console.log(stationKeyToIndex);

			var routeKeys = _(routes).map('key').sort().uniq().value();
			// console.log(routeKeys);

			var routeKeyToIndex = _(routeKeys).map(function (routeKey, routeIndex) {
				return [routeKey, routeIndex];
			}).fromPairs().value();
			// console.log(routeKeyToIndex);

			var lineKeys = _(routes).map('line').sort().uniq().value();
			// console.log(lineKeys);

			var lineKeyToIndex = _(lineKeys).map(function (lineKey, lineIndex) {
				return [lineKey, lineIndex];
			}).fromPairs().value();
			// console.log(lineKeyToIndex);

			// Station --> Lines
			// Station --> Routes
			var stations = _.map(stationKeys, function (stationKey, stationIndex) {
				var stationRoutes = _.filter(routes, function (route) {
					return route.stations.indexOf(stationKey) !== -1;
				});
				return {
					index: stationIndex,
					key: stationKey,
					name: networkInfo.formatStationName(stationKey),
					lines: _(stationRoutes).map('line').uniq().map(function (lineKey) {
						return lineKeyToIndex[lineKey];
					}).value(),
					routes: _(stationRoutes).map('key').map(function (routeKey) {
						return routeKeyToIndex[routeKey];
					}).value()
				};
			});
			// console.log(stations.slice(12, 15));

			// Route --> Train
			// Route --> Line
			// Route --> Stations
			// Route --> Stations (Interchanges)
			routes = routes.map(function (route, routeIndex) {
				var stationIndexes = _.map(route.stations, function (stationKey) {
					return stationKeyToIndex[stationKey];
				});

				var journeyTimes = [];
				if (typeof route.journeyTimes !== 'undefined') {
					journeyTimes = _.map(route.journeyTimes, function (time) {
						return time || 2;
					});
					if (route.stations.length - 1 !== journeyTimes.length) {
						console.warn('%s: %s: Expected %d journey times; got %d', networkKey, route.key, route.stations.length - 1, journeyTimes.length);
					}
				}
				if (route.stations.length - 1 !== journeyTimes.length) {
					journeyTimes = route.stations.map(function () {
						return 2;
					}).slice(1);
				}

				var viaName = route.via && route.via.length
					? _.map(route.via, function (stationKey) {
						return stations[stationKeyToIndex[stationKey]].name;
					}).join(', ')
					: '';
				var fromName = stations[_.first(stationIndexes)].name;
				var toName = stations[_.last(stationIndexes)].name;
				var fromViaName = fromName + (viaName ? ' via ' + viaName : '');
				var toViaName = toName + (viaName ? ' via ' + viaName : '');
				var name = fromName + ' to ' + toViaName;

				return {
					index: routeIndex,
					key: route.key,
					name: name,
					fromName: fromName,
					fromViaName: fromViaName,
					fromDirection: route.fromDirection,
					toName: toName,
					toViaName: toViaName,
					toDirection: route.toDirection,
					train: route.train,
					line: lineKeyToIndex[route.line],
					stations: stationIndexes,
					interchangeStations: _.filter(stationIndexes, function (stationIndex) {
						return stations[stationIndex].lines.length > 1;
					}),
					journeyTimes: journeyTimes
				};
			});
			// console.log(routes.slice(5, 7));
			// console.log(routes.slice(18, 19));

			// Line --> Routes
			lines = lines.map(function (line, lineIndex) {
				return {
					index: lineIndex,
					key: line.key,
					name: line.name,
					color: line.color,
					textColor: line.textColor,
					routes: _(routes).filter(function (route) {
						return route.line === lineIndex;
					}).map('index').value()
				};
			});
			// console.log(lines.slice(2, 4));

			console.log('%s: Processed %d stations on %d routes on %d lines.', networkKey, stations.length, routes.length, lines.length);

			return {
				key: networkKey,
				name: networkInfo.networkName,
				stationKeyToIndex: stationKeyToIndex,
				stations: stations,
				routeKeyToIndex: routeKeyToIndex,
				routes: routes,
				lineKeyToIndex: lineKeyToIndex,
				lines: lines
			};
		}).then(function (network) {
			var networkFileName = outputDirJson + networkKey + '.json';
			var networkData = JSON.stringify(network, null, '\t');
			var networkFileNameJs = outputDirJs + networkKey + '.js';
			var networkDataJs = 'define(' + JSON.stringify(network, null, '\t') + ');';
			return Promise.all([
				fs.writeFile(networkFileName, networkData)
					.then(function () {
						console.log('%s: Written %d bytes to %s.', networkKey, networkData.length, networkFileName);
					}),
				fs.writeFile(networkFileNameJs, networkDataJs)
					.then(function () {
						console.log('%s: Written %d bytes to %s.', networkKey, networkDataJs.length, networkFileNameJs);
					}),
			]);
		});
	}));
});
