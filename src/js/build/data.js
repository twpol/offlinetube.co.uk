/* jshint node: true */
var fs = require('fs');
var baseDir = 'src/js/data/';
var datasets = fs.readdirSync(baseDir);
for (var i = 0; i < datasets.length; i++) {
	var stat = fs.statSync(baseDir + datasets[i]);
	if (!stat.isDirectory()) {
		continue;
	}
	var build = [];
	var types = fs.readdirSync(baseDir + datasets[i]);
	for (var j = 0; j < types.length; j++) {
		var stat = fs.statSync(baseDir + datasets[i] + '/' + types[j]);
		if (!stat.isDirectory()) {
			continue;
		}
		var typeFile = baseDir + datasets[i] + '/' + types[j] + '.js';
		var typeFileFd = fs.openSync(typeFile, 'w');
		var items = fs.readdirSync(baseDir + datasets[i] + '/' + types[j]);
		fs.writeSync(typeFileFd, 'define([');
		for (var k = 0; k < items.length; k++) {
			fs.writeSync(typeFileFd, k === 0 ? '\n' : ',\n');
			fs.writeSync(typeFileFd, '\t\'./' + types[j] + '/' + items[k].replace('.js', '') + '\'');
		}
		fs.writeSync(typeFileFd, '\n], function () {\n\treturn {');
		for (var k = 0; k < items.length; k++) {
			fs.writeSync(typeFileFd, k === 0 ? '\n' : ',\n');
			fs.writeSync(typeFileFd, '\t\t\'' + items[k].replace('.js', '') + '\': arguments[' + k + ']');
		}
		fs.writeSync(typeFileFd, '\n\t};\n});');
		fs.closeSync(typeFileFd);
		build.push(items.length + ' ' + types[j]);
	}
	console.log('Built data for ' + datasets[i] + ': ' + build.join(', '));
}