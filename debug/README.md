To build `debug`:

1. install browserify and babelify
	`npm i browserify babelify`
2. build `debug.js`
	`./node_modules/.bin/browserify -t babelify ./debug/debug.babel.js > ./debug/debug.js`
3. open in Chrome (or other browser) and look at the 'profiles' section
	`./node_modules/.bin/opn ./debug/index.html`
