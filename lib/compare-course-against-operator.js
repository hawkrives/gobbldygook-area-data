import isObject from 'lodash/lang/isObject'
import isArray from 'lodash/lang/isArray'
import findOperatorType from './find-operator-type'
import includes from 'lodash/collection/includes'
import {BadTypeError} from './errors'
import assertKeys from './assert-keys'

export default function compareCourseAgainstOperator(course, key, operator) {
    const kind = findOperatorType(operator)

    if (isArray(operator[kind])) {
        throw new BadTypeError(`what would a comparison to a list even do? oh, wait; i
            suppose it could compare against one of several values... well, im
            not doing that right now. if you want it, edit the PEG and stick
            appropriate stuff in here (probably simplest to just call this
            function again with each possible value and return true if any are
            true.)`)
    }

    else if (isObject(operator[kind])) {
        // we compute the value of the function-over-where-query style operators
        // earlier, in the filterByQualification function.
        assertKeys(operator[kind], '$computed-value')
        const simplifiedOperator = {[kind]: operator[kind]['$computed-value']}
        return compareCourseAgainstOperator(course, key, simplifiedOperator)
    }

    else {
        // it's a static value; a number or string
        if (kind === '$eq') {
            if (isArray(course[key])) {
                return includes(course[key], operator[kind])
            }
            return course[key] === operator[kind]
        }
        else if (kind === '$ne') {
            if (isArray(course[key])) {
                return !includes(course[key], operator[kind])
            }
            return course[key] !== operator[kind]
        }
        else if (kind === '$lt') {
            return course[key] < operator[kind]
        }
        else if (kind === '$lte') {
            return course[key] <= operator[kind]
        }
        else if (kind === '$gt') {
            return course[key] > operator[kind]
        }
        else if (kind === '$gte') {
            return course[key] >= operator[kind]
        }
    }
}
