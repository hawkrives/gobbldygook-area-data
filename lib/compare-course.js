import isEqual from 'lodash/lang/isEqual'
import some from 'lodash/collection/some'

const keysToCheck = [
    'department',
    'international',
    'lab',
    'level',
    'number',
    'section',
    'semester',
    'year',
]

/**
 * Compares two courses
 * @private
 * @param {Course} course - the course to compare
 * @param {Course} to - the course to compare against
 * @returns {boolean} - if the course matched
 */
export default function compareCourse(course, to) {
    // 'course' might have more keys than the dict we're comparing it to.
    // 'to' will have some combination of `keysToCheck`.

    // we only check the specified keys
    // if any of them are not equal, we return false.
    const notEqual = some(keysToCheck, key => !isEqual(course[key], to[key]))

    if (notEqual) {
        return false
    }
    return true
}
