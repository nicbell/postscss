// Requires.
var postscss = require('../index');
var cssnano = require('cssnano');

// Compile sass.
function compile() {
	var nano = cssnano();

	postscss([nano]).process({
		from: 'test/src/test.scss',
		to: 'test/dist/test.css'
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
