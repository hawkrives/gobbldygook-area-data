#!/usr/bin/env node

'use strict'
const yaml = require('js-yaml')
const hasha = require('hasha')
const junk = require('junk')
const glob = require('glob')
const fs = require('fs')

function collectAreas() {
	return glob.sync('*/*.yaml').filter(junk.not)
}

function processArea(filename) {
	const file = fs.readFileSync(filename, 'utf-8')
	const data = yaml.safeLoad(file)

	return {
		hash: hasha(file),
		path: filename,
		type: data.type.toLowerCase(),
		revision: data.revision,
	}
}

function processAreasDir() {
	return JSON.stringify({
		type: 'areas',
		files: collectAreas().map(processArea),
	}, null, 2)
}

if (require.main === module) {
	fs.writeFileSync('info.json', processAreasDir() + '\n', 'utf-8')
}
