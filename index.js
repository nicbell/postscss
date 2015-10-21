/* global Promise */
var nodefs = require('node-fs');
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
	var plugins = this.plugins;
	var toName = path.basename(options.to);
	var dirName = path.dirname(options.to);

	var sassPromise = new Promise(function (resolve, reject) {
		console.log('Compiling SASS: ' + options.from);

		sass.render({
			file: options.from,
			to: options.to,
			outputStyle: 'compressed',
			precision: 10,
			sourceMap: true
		}, function (err, result) {

			if (err) {
				reject(err);
			}
			else {
				resolve(result);
			}
		});
	});

	var doPostCss = function (result) {
		console.log('Running PostCss: ' + toName);

		//Post css already implements promises.
		return postcss(plugins).process(result.css, {
			from: toName,
			to: toName,
			map: { inline: false }
		});
	};

	var writeToDisk = function (result) {
		console.log('Writing file: ' + options.to);

		nodefs.mkdirSync(dirName, '0777', true);
		nodefs.writeFile(options.to, result.css);
		nodefs.writeFile(options.to + '.map', result.map);
	};
	

	return sassPromise
		.then(doPostCss)
		.then(writeToDisk);
};


/**
 * Process many
 */
Processor.prototype.processMany = function (optionsArray) {
	var proms = []

	for (var i = 0; i < optionsArray.length; i++) {
		proms.push(this.process(optionsArray[i]));
	}

	return Promise.all(proms);
};


module.exports = function (plugins) {
	return new Processor(plugins);
};