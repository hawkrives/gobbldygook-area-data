import {chain, clone, toArray, find, isNull} from 'lodash'

import majors from './src/major'
import concentrations from './src/concentration'
import emphases from './src/emphasis'
import degrees from './src/degree'

let areas = [majors, concentrations, emphases, degrees]
let allAreas = chain(areas)
	.map(toArray)
	.flatten()
	.value()

let areaNotFound = {
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
let findAreaOfStudy = (id, yearOfGraduation) => {
	let area = find(allAreas, (area) => {
		if (!area.id || area.id !== id)
			return false

		if (!area.years)
			return false

		let [startYear, endYear] = area.years

		let yearIsBetween = false
		if (isNull(endYear) && startYear <= yearOfGraduation)
			yearIsBetween = true
		else if (endYear >= yearOfGraduation && startYear <= yearOfGraduation)
			yearIsBetween = true

		return yearIsBetween
	})

	return area || clone(areaNotFound)
}

export default findAreaOfStudy
