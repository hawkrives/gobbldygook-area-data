import uniq from 'lodash/array/uniq'
import pluck from 'lodash/collection/pluck'
import size from 'lodash/collection/size'

export default function countCourses(courses) {
    return size(uniq(pluck(courses, 'crsid')))
}
