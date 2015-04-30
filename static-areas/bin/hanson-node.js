'use strict';

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

var _yaml = require('js-yaml');

var _yaml2 = _interopRequireWildcard(_yaml);

var _process = require('process');

var _process2 = _interopRequireWildcard(_process);

var _fsLib = require('fs');

var _fsLib2 = _interopRequireWildcard(_fsLib);

var _Promise = require('bluebird');

var _Promise2 = _interopRequireWildcard(_Promise);

var _import = require('lodash');

var _import2 = _interopRequireWildcard(_import);

var fs = _Promise2['default'].promisifyAll(_fsLib2['default']);

function loadFile(path) {
	var doc = fs.readFileSync(path, 'utf8');
	return _yaml2['default'].safeLoad(doc, { filename: path });
}

function checkForRequiredBaseKeys(rawFile) {
	var requiredKeys = ['title', 'type', 'revision', 'result'];
	return _import2['default'].all(requiredKeys, function (key) {
		return _import2['default'].has(rawFile, key);
	});
}

function expandResults(_ref) {
	var areaType = _ref.areaType;
	var areaTitle = _ref.areaTitle;
	var setTitle = _ref.setTitle;
	var reqTitle = _ref.reqTitle;
	var resultString = _ref.resultString;

	var overridePath = [areaType, areaTitle].concat(setTitle ? [setTitle] : []).concat(reqTitle ? [reqTitle] : []);

	var overridePathString = _import2['default'].map(overridePath, function (segment) {
		return '\'' + segment + '\'';
	}).join(', ');
	// console.log(overridePathString)

	// const js = `const override = o('${areaType}', '${areaTitle}', '${setTitle}', '${reqTitle}')
	// const matches = [c({dept: 'CSCI', num: 121}), c({dept: 'CSCI', num: 125})]

	// let result = false
	// if (!override) {
	// 	const results = map(matches, (m) => Boolean(size(m)))
	// 	result = results[0] || results[1]
	// }`

	return resultString;
}

function addResult(requirement, key) {
	if (typeof requirement == 'string' && key != 'result') {
		requirement = { result: requirement };
	}

	// console.log('<key, requirement>: ', key, JSON.stringify(requirement))

	if (_import2['default'].any(_import2['default'].keys(requirement), function (key) {
		return key.match(/^[A-Z]/);
	})) {
		requirement = _import2['default'].mapValues(requirement, addResult);
	}

	return requirement;
}

function processFile(rawFile, _ref2) {
	var title = _ref2.title;
	var type = _ref2.type;
	var revision = _ref2.revision;

	if (!checkForRequiredBaseKeys(rawFile)) {
		console.error('you don\'t have all of the required keys!');
		return;
	}

	// let stageOne = categorizeRequirements(rawFile)

	var onlyReqs = _import2['default'].omit(rawFile, function (req, key) {
		return key.match(/^[a-z]/);
	});
	var mapped = _import2['default'].mapValues(onlyReqs, addResult);
	var mapped2 = _import2['default'].mapValues(mapped, function (req, key) {
		return expandResults({
			areaType: type,
			areaTitle: title,
			resultString: req });
	});

	return mapped;
}

function expandOperators(data) {
	return _import2['default'].mapValues(data, function (value, key) {
		if (key === 'result') {
			value = value.replace(/(\||\&)/g, '$1$1');
		} else if (_import2['default'].isObject(value)) {
			value = expandOperators(value);
		}
		return value;
	});
}

function autoFillDepartments(data) {
	var lastDept = '';
	return data
	// return _.mapValues(data, (value, key) => {
	// 	if (key === 'result') {
	// 		value = value.replace(/(\||\&)/g, '$1$1')
	// 	}
	// 	else if (_.isObject(value)) {
	// 		value = expandOperators(value)
	// 	}
	// 	return value
	// })
	;
}

function main() {
	var argv = _process2['default'].argv;
	if (_process2['default'].argv.length < 3) {
		console.info('' + argv[1] + ' inputFile [outputFile]');
	}

	// get the file
	var rawFile = loadFile(argv[2]);
	var title = rawFile.title;
	var type = rawFile.type;
	var revision = rawFile.revision;
	var result = rawFile.result;

	//
	// PHASE I: EXPAND YAML
	//

	// make it consistent – do the things that we let people leave out
	// like adding the implied "result" to requirements
	var processedFile = processFile(rawFile, { title: title, type: type, revision: revision });
	processedFile.info = { title: title, type: type, revision: revision, result: result };

	// categorize things: requirements vs. requirement sets

	// expand result strings
	// 1. Auto-fill departments
	//     CS 350 & 364 | STAT 110 to CS 360 & CS 364 | STAT 110
	var filled = autoFillDepartments(processedFile);
	// 2. Expand logical operators
	//     | to ||, & to &&
	var expanded = expandOperators(filled);

	//
	// PHASE 2: CONVERT TO JS
	//

	//

	// PHASE 3: EXPAND INTO FUNCTIONS

	console.log(_yaml2['default'].safeDump(expanded));
}

main();
// console.log(processedFile)

