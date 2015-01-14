import {chain, clone, toArray, find, isNull} from 'lodash'

import majors from './major'
import concentrations from './concentration'
import emphases from './emphasis'
import degrees from './degree'

let areas = [majors, concentrations, emphases, degrees]
let allAreas = chain(areas)
	.map(toArray)
	.flatten()
	.value()

let areaNotFound = {
	title: 'Not Found',
	revisionYear: null,
	id: 'a-notfound',
	type: 'not-found',
	departmentAbbr: 'NOTFOUND',
	check: null,
}

/**
 * Finds an area of study.
 *
 * @param {String} id - the id to find.
 * @param {Number} yearOfRevision - the year the student matriculated.
 * @returns {Object} - an area of study.
 */
let findAreaOfStudy = (id, yearOfRevision) => {
	let area = find(allAreas, {id: id, revisionYear: yearOfRevision})

	return area || clone(areaNotFound)
}

export default findAreaOfStudy
export {allAreas}
