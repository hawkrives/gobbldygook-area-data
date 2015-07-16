import countCourses from '../lib/count-courses'

describe('countCourses', () => {
    it('counts the number of distinct courses in an array', () => {
        const courses = [
            {crsid: 310},
            {crsid: 311},
            {crsid: 310},
        ]
        expect(countCourses(courses)).to.equal(2)
    })
})
