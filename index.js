/* global Promise */
var nodefs = require('node-fs');
var path = require('path');
var sass = require('node-sass');
var postcss = require('postcss');
var eyeglass = require('eyeglass');
var chalk = require('chalk');


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

	// Wrap node-sass in a promise.
	var sassPromise = new Promise(function (resolve, reject) {
		sass.render(eyeglass({
			file: options.from,
			outFile: options.to,
			precision: 10,
			sourceMap: true,
			sourceMapEmbed: true,
			importer: options.importer || null
		}), function (err, result) {
			if (err) {
				reject(err);
			}
			else {
				resolve(result);
			}
		});
	});

	// PostCss already implements promises, so we just return it.
	var doPostCss = (result) => {
		var toName = path.basename(options.to);

		return postcss(this.plugins).process(result.css, {
			from: toName,
			to: toName,
			map: { inline: false }
		});
	};

	// Write results to disk.
	var writeToDisk = (result) => {
		nodefs.mkdirSync(path.dirname(options.to), '0777', true);
		nodefs.writeFileSync(options.to, result.css);
		console.log(chalk.green('>>'), chalk.cyan(options.to), 'created.');

		if (!options.sourceMapDisabled) {
			nodefs.writeFileSync(options.to + '.map', result.map.toString());
			console.log(chalk.green('>>'), chalk.cyan(options.to + '.map'), 'created.');
		}
	};

	return sassPromise
		.then(doPostCss)
		.then(writeToDisk);
};


/**
 * Process many
 */
Processor.prototype.processMany = function (optionsArray) {
	var proms = optionsArray.map((item) => this.process(item));

	return Promise.all(proms);
};


module.exports = function (plugins) {
	return new Processor(plugins);
};