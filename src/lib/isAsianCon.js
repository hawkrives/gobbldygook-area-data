import {all, contains} from 'lodash'
import {hasDepartment} from 'sto-helpers'

/**
 * Returns true if a course is part of the AsianCon sequence.
 *
 * @param {String} course
 * @returns {Boolean}
 */
function isAsianCon(course) {
	return all([
		hasDepartment('ASIAN', course),
		contains([210, 215, 216, 220], course.num), // these are the asiancon course numbers
	])
}

export default isAsianCon
