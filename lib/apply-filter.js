import has from 'lodash/object/has'
import filter from 'lodash/collection/filter'
import filterByWhereClause from './filter-by-where-clause'
import some from 'lodash/collection/some'
import compareCourse from './compareCourse'

export default function applyFilter(expr, courses) {
    let filtered = []
    if (has(expr, '$where')) {
        filtered = filterByWhereClause(courses, expr.$where)
    }
    else if (has(expr, '$of')) {
        filtered = filter(expr.$of, course => some(courses, c => compareCourse(course, c)))
    }
    expr._matches = filtered
    return filtered
}
