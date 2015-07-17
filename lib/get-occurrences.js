import filter from 'lodash/collection/filter'
import compareCourse from './compare-course'

/**
 * Filters a list of courses to just the occurrences of a certain course
 * @private
 * @param {Course} course - the course to find occurrences of
 * @param {Course[]} courses - the list of courses
 * @returns {Course[]} - the list of occurrences of that course
 */
export default function getOccurrences(course, courses) {
    return filter(courses, (c) => compareCourse(c, filter))
}
