var fs = require('fs');
var path = require('path');
var sass = require('node-sass');
var postcss = require('postcss');

/**
 * @constructor
 */
function Processor(plugins) {
	this.plugins = plugins;
}

/**
 * Process single
 */
Processor.prototype.process = function (options) {
	var fromName = path.basename(options.from),
		toName = path.basename(options.to);

	console.log(fromName + ' => ' + toName);

	sass.render({
		file: options.from,
		to: options.to,
		outputStyle: 'compressed',
		precision: 10,
		sourceMap: true
	}, function (err, result) {
		console.log('SASS compiled.');

		if (!err) {
			//Post css
			postcss(this.plugins).process(result.css, {
				from: toName,
				to: toName,
				map: { inline: false }
			}).then(function (result) {
				var dirName = path.dirname(options.to);
				var dirStats = fs.lstatSync(dirName);

				if (!dirStats.isDirectory()) {
					console.log('Creating output directory.');
					fs.mkdirSync(dirName);
				}

				fs.writeFile(options.to, result.css);
				fs.writeFile(options.to + '.map', result.map);
				console.log('PostCSS transforms run.');
			});
		}
		else {
			console.log(err);
		}
	}.bind(this));
};

/**
 * Process many
 */
Processor.prototype.processMany = function (optionsArray) {
	for (var i = 0; i < optionsArray.length; i++) {
		this.process(optionsArray[i]);
	}
}

module.exports = function (plugins) {
	return new Processor(plugins);
};