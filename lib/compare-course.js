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

export function compareCourse(course, to) {
    // 'course' might have more keys than the dict we're comparing it to.
    // 'to' will have some combination of `keysToCheck`.

    const notEqual = some(keysToCheck, key => !isEqual(course[key], to[key]))

    if (notEqual) {
        return false
    }
    return true
}
