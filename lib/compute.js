import mapValues from 'lodash/object/mapValues'
import isRequirementName from './is-requirement-name'
import has from 'lodash/object/has'
import applyFilter from './apply-filter'
import computeChunk from './compute-chunk'
import hasOverride from './has-override'
import getOverride from './get-override'

// The overall computation is done by compute, which is in charge of computing
// sub-requirements and such.

export default function compute(requirement, path, courses=[], overrides={}) {
    requirement = mapValues(requirement, (req, name) => {
        if (isRequirementName(name)) {
            return compute(req, path.concat([name]), courses, overrides)
        }
        return req
    })

    let computed = false

    // Apply a filter to the set of courses
    if (has(requirement, 'filter')) {
        courses = applyFilter(requirement.filter, courses)
    }

    // Now check for results
    if (has(requirement, 'result')) {
        if (requirement.result === '') {
            throw new SyntaxError(`compute(): requirement.result must not be empty (in ${JSON.stringify(requirement)})`)
        }
        computed = computeChunk(requirement.result, requirement, courses)
    }

    // or ask for an override
    else if (has(requirement, 'message')) {
        // TODO: show a button to toggle overriding
        computed = false
    }

    // or throw an error
    else {
        throw new TypeError('either message or result is required')
    }

    requirement.computed = computed

    if (hasOverride(path, overrides)) {
        requirement.overridden = true
        requirement.computed = getOverride(path, overrides)
    }

    return requirement
}
