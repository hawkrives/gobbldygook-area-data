import filter from 'lodash/collection/filter'
import compareCourse from './compare-course'

export default function getOccurrences(course, courses) {
    return filter(courses, (c) => compareCourse(c, filter))
}
