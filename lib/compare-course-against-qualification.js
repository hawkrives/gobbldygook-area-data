import isObject from 'lodash/lang/isObject'
import isArray from 'lodash/lang/isArray'
import includes from 'lodash/collection/includes'
import assertKeys from './assert-keys'

/**
 * Compares a course property against a MongoDB-style operator
 * @private
 * @param {Course} course - the course to check
 * @param {string} $key - the property to check
 * @param {string} $operator - the operator to check against
 * @param {string} $value - the value compare to
 * @returns {boolean} - whether the course matched or not
 */
export default function compareCourseAgainstQualification(course, {$key, $operator, $value}) {
    if (isArray($value)) {
        throw new TypeError(`compareCourseAgainstQualification(): what would a comparison to a list even do? oh, wait; i suppose it could compare against one of several values... well, I'm not doing that right now. if you want it, edit the PEG and stick appropriate stuff in here (probably simplest to just call this function again with each possible value and return true if any are true.)`)
    }

    else if (isObject($value)) {
        // we compute the value of the function-over-where-query style
        // operators earlier, in the filterByQualification function.
        assertKeys($value, '$computed-value')
        const simplifiedOperator = {$key, $operator, $value: $value['$computed-value']}
        return compareCourseAgainstQualification(course, simplifiedOperator)
    }

    else {
        // it's a static value; a number or string
        if ($operator === '$eq') {
            if (isArray(course[$key])) {
                return includes(course[$key], $value)
            }
            return course[$key] === $value
        }
        else if ($operator === '$ne') {
            if (isArray(course[$key])) {
                return !includes(course[$key], $value)
            }
            return course[$key] !== $value
        }
        else if ($operator === '$lt') {
            return course[$key] < $value
        }
        else if ($operator === '$lte') {
            return course[$key] <= $value
        }
        else if ($operator === '$gt') {
            return course[$key] > $value
        }
        else if ($operator === '$gte') {
            return course[$key] >= $value
        }
    }
}