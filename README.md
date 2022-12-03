# PostScss [![NPM](https://nodei.co/npm/postscss.png?mini=true)](https://nodei.co/npm/postscss/) [![Downloads](https://img.shields.io/npm/dt/postscss.svg)](https://www.npmjs.com/package/postscss)
<img src="https://user-images.githubusercontent.com/151842/205453502-c92ab83c-1d6a-46fb-9d59-22eafe168047.png" width="80">&nbsp;&nbsp;<img src="https://user-images.githubusercontent.com/151842/205453464-8b3dd49a-9fb0-4276-814c-8994e7d36c4f.png" width="80">

node-sass +  PostCss = PostScss.

PostScss compiles SASS into CSS then runs [PostCSS](https://github.com/postcss/postcss) plugins. It also supports importing Eyeglass modules.

## Install
`npm i postscss`

## Usage
```js
var postscss = require('postscss');

// Single build
postscss([postcss plugins]).process({
	from: 'xxx/src/scss/xxx.scss',
	to: 'xxx/dist/css/xxx.css'
});

// Disabling source maps
postscss([postcss plugins]).process({
	from: 'xxx/src/scss/xxx.scss',
	to: 'xxx/dist/css/xxx.css',
	sourceMapDisabled: true
});

// Multiple builds
postscss([postcss plugins]).processMany([{
	from: 'xxx/src/scss/xxx.scss',
	to: 'xxx/dist/css/xxx.css'
}, {
	from: 'xxx/src/scss/xxx2.scss',
	to: 'xxx/dist/css/xxx2.css'
}]);
```
## Promises
```js
var postscss = require('postscss');

postscss([postcss plugins]).process({
	from: 'xxx/src/scss/xxx.scss',
	to: 'xxx/dist/css/xxx.css'
})
.then(function() {
	console.log('All done.');
})
.catch(function(error) {
	// Error handling.
});
```
## PostCss plugins example
```js
var postscss = require('postscss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');

postscss([autoprefixer(['> 5%', 'last 2 versions', 'ie > 7']), cssnano()]).process({
	from: 'xxx/src/scss/xxx.scss',
	to: 'xxx/dist/css/xxx.css'
});
```
## Grunt example
```js
grunt.registerTask('compileSCSS', 'Task description.', function () {
	var done = this.async();

	var postscss = require('postscss');

	postscss([postcss plugins]).process({
		from: 'xxx/src/scss/xxx.scss',
		to: 'xxx/dist/css/xxx.css'
	})
	.then(done);
});
```
## SASS importer
```js
var postscss = require('postscss');
var npmsass = require('npm-sass');

postscss([postcss plugins]).process({
	from: 'xxx/src/scss/xxx.scss',
	to: 'xxx/dist/css/xxx.css',
	importer: npmsass.importer
});
```
