var lodash = require('lodash')
var chain = lodash.chain
var clone = lodash.clone
var toArray = lodash.toArray
var find = lodash.find
var isNull = lodash.isNull

var majors = require('./dist/major')
var concentrations = require('./dist/concentration')
var emphases = require('./dist/emphasis')
var degrees = require('./dist/degree')

var areas = [majors, concentrations, emphases, degrees]
var allAreas = chain(areas)
	.map(toArray)
	.flatten()
	.value()

var areaNotFound = {
	title: 'Not Found',
	years: [null, null],
	id: 'a-notfound',
	type: 'not-found',
	departmentAbbr: 'NOTFOUND',
	check: null,
}

/**
 * Finds an area of study.
 *
 * @param {String} id - the id to find.
 * @param {Number} yearOfGraduation - the year the student matriculated.
 * @returns {Object} - an area of study.
 */
var findAreaOfStudy = function(id, yearOfGraduation) {
	var area = find(allAreas, function(area) {
		if (!area.id || area.id !== id)
			return false

		if (!area.years)
			return false

		var startYear = area.years[0]
		var endYear = area.years[1]

		var yearIsBetween = false
		if (isNull(endYear) && startYear <= yearOfGraduation)
			yearIsBetween = true
		else if (endYear >= yearOfGraduation && startYear <= yearOfGraduation)
			yearIsBetween = true

		return yearIsBetween
	})

	return area || clone(areaNotFound)
}

module.exports = findAreaOfStudy
