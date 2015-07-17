import isEqual from 'lodash/lang/isEqual'
import every from 'lodash/collection/every'
import keys from 'lodash/object/keys'
import filter from 'lodash/collection/filter'
import includes from 'lodash/collection/includes'

const baseKeys = [
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
export default function compareCourse(query, other) {
    // if the query is more specific than the one being compared to, and
    // things don't match, return false.
    // but, if the query is *less* specific than the other course, only check
    // the props that are in the query.

    // the master list of the keys we care about is in baseKeys, so we grab
    // the keys that overlap between baseKeys and the list of keys in the
    // query object.
    const keysToCheck = filter(keys(query), key => includes(baseKeys, key))

    // we only check the specified keys.
    // if any of them are not equal, we return false.
    const equal = every(keysToCheck, key => isEqual(query[key], other[key]))

    return equal
}
