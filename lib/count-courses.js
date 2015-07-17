import uniq from 'lodash/array/uniq'
import pluck from 'lodash/collection/pluck'
import size from 'lodash/collection/size'

/**
 * Counts the number of unique courses in a list of courses
 * (by passing them to simplifyCourses)
 * @private
 * @param {Course[]} courses - the list of courses
 * @returns {number} - the number of unique courses
 */
export default function countCourses(courses) {
    return size(uniq(pluck(courses, 'crsid')))
}
