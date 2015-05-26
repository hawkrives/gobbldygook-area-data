import yaml from 'js-yaml'
import fsLib from 'fs'
import Promise from 'bluebird'
import _ from 'lodash'

const fs = Promise.promisifyAll(fsLib)

function loadFile(path) {
	const doc = fs.readFileSync(path, 'utf8')
	return yaml.safeLoad(doc, {filename: path})
}

function checkForRequiredBaseKeys(rawFile) {
	const requiredKeys = ['title', 'type', 'revision', 'result']
	return _.all(requiredKeys, (key) => _.has(rawFile, key))
}

function addResult(requirement, key) {
	if (typeof requirement === 'string' && key !== 'result') {
		requirement = {result: requirement}
	}

	// console.log('<key, requirement>: ', key, JSON.stringify(requirement))

	if (_.any(_.keys(requirement), (key) => key.match(/^[A-Z]/))) {
		requirement = _.mapValues(requirement, addResult)
	}

	return requirement
}

function processFile(rawFile, {title, type, revision}) {
	if (!checkForRequiredBaseKeys(rawFile)) {
		console.error(`you don't have all of the required keys!`)
		return
	}

	// let stageOne = categorizeRequirements(rawFile)

	let onlyReqs = _.omit(rawFile, (req, key) => key.match(/^[a-z]/))
	let mapped = _.mapValues(onlyReqs, addResult)
	let mapped2 = _.mapValues(mapped, (req, key) => expandResults({
		areaType: type,
		areaTitle: title,
		resultString: req,
	}))

	return mapped
}

function expandOperators(data) {
	return _.mapValues(data, (value, key) => {
		if (key === 'result') {
			value = value.replace(/(\||\&)/g, '$1$1')
		}
		else if (_.isObject(value)) {
			value = expandOperators(value)
		}
		return value
	})
}

function autoFillDepartments(data) {
	let lastDept = ''
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
}

function main() {
	const argv = process.argv
	if (process.argv.length < 3) {
		console.info(`${argv[1]} inputFile [outputFile]`)
	}

	// get the file
	const rawFile = loadFile(argv[2])
	const {title, type, revision, result} = rawFile

	//
	// PHASE I: EXPAND YAML
	//

	// make it consistent – do the things that we let people leave out
	// like adding the implied "result" to requirements
	const processedFile = processFile(rawFile, {title, type, revision})
	processedFile.info = {title, type, revision, result}

	// categorize things: requirements vs. requirement sets

	// expand result strings
	// 1. Auto-fill departments
	//     CS 350 & 364 | STAT 110 to CS 360 & CS 364 | STAT 110
	const filled = autoFillDepartments(processedFile)
	// 2. Expand logical operators
	//     | to ||, & to &&
	const expanded = expandOperators(filled)

	//
	// PHASE 2: CONVERT TO JS
	//

	//

	// PHASE 3: EXPAND INTO FUNCTIONS

	console.log(yaml.safeDump(expanded))
	// console.log(processedFile)
}

main()
