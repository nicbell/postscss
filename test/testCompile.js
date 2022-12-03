// Requires.
var postscss = require('../index');
var cssnano = require('cssnano');
var autoprefixer = require('autoprefixer');

// Compile SCSS to CSS, auto prefix then shrink using nano.
function compile() {
	postscss([autoprefixer('> 5%', 'last 2 versions', 'ie > 7'), cssnano()]).process({
		from: 'test/src/test.scss',
		to: 'test/dist/test.css'
	}).catch(function (error) {
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
