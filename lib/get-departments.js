import uniq from 'lodash/array/uniq'
import flatten from 'lodash/array/flatten'
import pluck from 'lodash/collection/pluck'

export default function getDepartments(courses) {
    return uniq(flatten(pluck(courses, 'department')))
}
