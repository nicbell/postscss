// Requires.
var postscss = require('../index');
var cssnano = require('cssnano');
var npmsass = require('npm-sass');

// Compile sass.
function compile() {

	postscss([cssnano()]).process({
		from: 'test/src/test.scss',
		to: 'test/dist/test.css',
		importer: npmsass.importer
	})
	.catch(function(error) {
		console.error('\n' + error + '\n');
	});
}

// Commandline options.
if (process) {
	if (process.argv.indexOf('-c')) compile();
}

module.exports = {
	compile: compile
}
