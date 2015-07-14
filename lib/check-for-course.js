import some from 'lodash/collection/some'
import compareCourse from './compare-course'

export default function checkForCourse(query, courses) {
    return some(courses, (c) => compareCourse(c, query))
}
