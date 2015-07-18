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
    // If the query is more specific than the one being compared to, and
    // things don't match, return false.
    // But, if the query is *less* specific than the other course, only check
    // the props that are in the query.

    // The master list of the keys we care about is in `baseKeys`, so we grab
    // the keys that overlap between `baseKeys` and the list of keys in the
    // query object.

    // this should accomplish the same effect as
    // `intersection(keys(query), baseKeys)`,
    // but it benchmarks quite a bit faster.
    const keysToCheck = filter(keys(query), key => includes(baseKeys, key))

    // We only check the specified keys.
    // If any of them are not equal, we return false.
    const isEqual = every(keysToCheck, key => isEqual(query[key], other[key]))

    return isEqual
}
