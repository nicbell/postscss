 /* global Promise */
var nodefs = require('node-fs');
var path = require('path');
var sass = require('node-sass');
var postcss = require('postcss');
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
	var plugins = this.plugins;
	var toName = path.basename(options.to);
	var dirName = path.dirname(options.to);

	// Wrap node-sass in a promise
	var sassPromise = new Promise(function (resolve, reject) {
		sass.render({
			file: options.from,
			outFile: options.to,
			precision: 10,
			sourceMap: true,
			sourceMapEmbed: true,
			importer: require('npm-sass').importer,
		}, function (err, result) {
			if (err) {
				reject(err);
			}
			else {
				resolve(result);
			}
		});
	});

	// PostCss already implements promises, so we just return it.
	var doPostCss = function (result) {
		return postcss(plugins).process(result.css, {
			from: toName,
			to: toName,
			map: { inline: false }
		});
	};

	var writeToDisk = function (result) {
		nodefs.mkdirSync(dirName, '0777', true);
		nodefs.writeFileSync(options.to, result.css);
		nodefs.writeFileSync(options.to + '.map', result.map);

		console.log(chalk.green('>>'), chalk.cyan(options.to), 'created.');
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
