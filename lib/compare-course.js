import isEqual from 'lodash/lang/isEqual'
import every from 'lodash/collection/every'

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
 * @param {Course} query - the course to compare
 * @param {Course} other - the course to compare against
 * @returns {boolean} - if the course matched
 */
    // 'course' might have more keys than the dict we're comparing it to.
    // 'to' will have some combination of `keysToCheck`.
export default function compareCourse(query, other) {

    // we only check the specified keys.
    // if any of them are not equal, we return false.
    const equal = every(keysToCheck, key => isEqual(query[key], other[key]))

    return equal
}
