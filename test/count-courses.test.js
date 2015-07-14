import tape from 'tape'
import countCourses from '../lib/countCourses'

tape.test('countCourses', (t) => {
    const courses = [
        {crsid: 310},
        {crsid: 311},
        {crsid: 310},
    ]
    t.equal(countCourses(courses), 2, 'counts the number of distinct courses in an array')
})
