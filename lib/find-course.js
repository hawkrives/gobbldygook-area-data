import find from 'lodash/collection/find'
import compareCourse from './compare-course'

export default function findCourse(query, courses) {
    return find(courses, (c) => compareCourse(c, query))
}
