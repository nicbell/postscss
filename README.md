# PostScss
node-sass +  PostCss = PostScss

## Usage
```js
var postscss = require('postscss');

postscss([postcss plugins]).process({
	from: 'xxx/src/scss/xxx.scss',
	to: 'xxx/dist/css/xxx.css'
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
grunt.registerTask('compileSCSS', 'Compiles SCSS to CSS and applies PostCSS plugins.', function () {
	this.async();
	
	var postscss = require('postscss');
	
	postscss([postcss plugins]).process({
		from: 'xxx/src/scss/xxx.scss',
		to: 'xxx/dist/css/xxx.css'
	});
});
```
