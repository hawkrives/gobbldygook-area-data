import clone from 'lodash/lang/clone'
import find from 'lodash/collection/find'
import flatten from 'lodash/array/flatten'
import isNull from 'lodash/lang/isNull'
import map from 'lodash/collection/map'
import toArray from 'lodash/lang/toArray'

import * as majors from './major'
import * as concentrations from './concentration'
import * as emphases from './emphasis'
import * as degrees from './degree'

const areas = [majors, concentrations, emphases, degrees]
const allAreas = flatten(map(areas, toArray))

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
function findAreaOfStudy(id, yearOfRevision) {
	const area = find(allAreas, {id: id, revisionYear: yearOfRevision})

	return area || clone(areaNotFound)
}

export default findAreaOfStudy
export {allAreas}
