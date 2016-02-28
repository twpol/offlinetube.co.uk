define([
	'library/lodash/lodash',
	'./london/routes',
	'./london/trains',
	'./london/lines',
	'./london/stations'
], function (_, routes, trains, lines, stations) {
	var addKey = function (object, key) {
		object.key = key;
	};

	var addLinkList = function (source, sourceName, destination, destinationName, keyName) {
		_.forEach(source, function (sourceObject, sourceKey) {
			sourceObject[sourceName] = _(destination).filter(function (destinationObject) {
				return _.includes(destinationObject[destinationName], sourceKey);
			}).map(keyName).uniq().value();
		});
	};

	/* jshint devel: true */
	console.time('london-station-creation');
	_.forEach(routes, function (route) {
		_.forEach(route.stations, function (station) {
			if (!(station in stations)) {
				stations[station] = {
					name: station
						.replace(/-/g, ' ')
						.replace(/\w+/g, function (word) {
							return word.substr(0, 1).toUpperCase() + word.substr(1);
						})
						.replace(' And ', ' and ')
						.replace('Bromley By ', 'Bromley-by-')
						.replace('Earls ', 'Earl\'s ')
						.replace(' Jamess', ' James\'s')
						.replace(' Johns', ' John\'s')
						.replace(' On The Hill', '-on-the-Hill')
						.replace(' Pauls', ' Paul\'s')
						.replace('Queens ', 'Queen\'s ')
						.replace('Regents ', 'Regent\'s ')
						.replace('Shepherds ', 'Shepherd\'s ')
						.replace('St ', 'St. ')
				};
			}
		});
	});
	console.timeEnd('london-station-creation');

	console.time('london-setup');
	_.forEach(routes, addKey);
	_.forEach(trains, addKey);
	_.forEach(lines, addKey);
	_.forEach(stations, addKey);
	console.timeEnd('london-setup');

	console.time('london-route-setup');
	_.forEach(routes, function (route) {
		route.from = _.first(route.stations);
		route.to = _.last(route.stations);
		route.viaName = route.via && route.via.length ? _.map(route.via, function (station) { return stations[station].name; }).join(', ') : '';
		route.fromName = stations[route.from].name;
		route.fromViaName = route.fromName + (route.viaName ? ' via ' + route.viaName : '');
		route.toName = stations[route.to].name;
		route.toViaName = route.toName + (route.viaName ? ' via ' + route.viaName : '');
		route.name = route.fromName + ' to ' + route.toViaName;
		route.stationInRoute = {};
		_.forEach(route.stations, function (station) {
			route.stationInRoute[station] = true;
		});
	});
	console.timeEnd('london-route-setup');

	console.time('london-station-setup');
	addLinkList(stations, 'routes', routes, 'stations', 'key');
	addLinkList(stations, 'lines', routes, 'stations', 'line');
	_.forEach(stations, function (station) {
		station.interchange = station.lines.length > 1;
	});
	console.timeEnd('london-station-setup');

	console.time('london-check-links');
	_.forEach(routes, function (route) {
		if (route.from !== _.first(route.stations)) { console.warn('  %s: From station "%s" does not match first station "%s"', route.key, route.from, _.first(route.stations)); }
		if (route.to !== _.last(route.stations)) { console.warn('  %s: To station "%s" does not match last station "%s"', route.key, route.to, _.last(route.stations)); }
		_.forEach(route.via, function (via) {
			if (!_.includes(route.stations, via)) { console.warn('  %s: Via station "%s" not found in station list', route.key, via); }
		});
		// if (!(route.train in trains)) { console.warn('  %s: Train "%s" not found', route.key, route.train); }
		if (!(route.line in lines)) { console.warn('  %s: Line "%s" not found', route.key, route.line); }
	});
	_.forEach(stations, function (station) {
		_.forEach(station.links, function (link, linkIndex) {
			_.forEach('a b from to'.split(' '), function (linkType) {
				_.forEach(link[linkType], function (route) {
					if (route) {
						if (!(route in routes)) { console.warn('  %s: Link %d.%s to route "%s" does not exist', station.key, linkIndex, linkType, route); }
						if (route in routes) {
							if (!_.includes(routes[route].stations, station.key)) { console.warn('  %s: Link %d.%s to route "%s" does not link back', station.key, linkIndex, linkType, route); }
						}
					}
				});
			});
		});
	});
	console.timeEnd('london-check-links');

	return {
		key: 'london',
		name: 'London Underground',
		trains: trains,
		lines: lines,
		stations: stations,
		routes: routes
	};
});