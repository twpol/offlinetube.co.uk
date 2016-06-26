/* eslint-env node */

exports.networkName = 'London Underground';

exports.formatStationName = function (name) {
	return name
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
		.replace('St ', 'St. ');
}