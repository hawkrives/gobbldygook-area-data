import flatten from 'lodash/array/flatten'
import map from 'lodash/collection/map'

/**
 * Collects matched courses from a result object
 * @private
 * @param {Result} expr - the result object to extract matches from
 * @returns {Course[]} matches - the list of matched courses
 */
export default function collectMatches(expr) {
    const type = expr.$type

    let matches = []
    if (type === 'requirement') {
        matches = collectMatches(expr.result)
    }
    else if (type === 'boolean') {
        matches = flatten(map(expr.$and || expr.$or || [], collectMatches))
    }
    else if (type === 'course') {
        if (expr._result === true) {
            matches = [expr]
        }
    }
    else if (type === 'modifier') {
        matches = expr._matches
    }
    else if (type === 'occurrence') {
        matches = expr._matches
    }
    else if (type === 'of') {
        matches = flatten(map(expr.$of, collectMatches))
    }
    else if (type === 'reference') {
        matches = expr._matches
    }
    else if (type === 'where') {
        matches = expr._matches
    }

    return matches
}
