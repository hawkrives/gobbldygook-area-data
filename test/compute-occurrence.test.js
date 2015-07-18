import {computeOccurrence} from '../lib/compute-chunk'

describe('computeOccurrence', () => {
    it('computes the number of times a course has been taken vs. a minimum count', () => {
        const expr = {
            $type: 'occurrence',
            $count: 2,
            $course: {$type: 'course', department: ['THEAT'], number: 222},
        }

        const courses = [
            {$type: 'course', department: ['THEAT'], number: 222},
            {$type: 'course', department: ['THEAT'], number: 222},
        ]

        expect(computeOccurrence(expr, courses)).to.be.true
    })

    it('ignores anything besides department and number via simplifyCourse', () => {
        const expr = {
            $type: 'occurrence',
            $count: 2,
            $course: {$type: 'course', department: ['THEAT'], number: 222},
        }

        const courses = [
            {$type: 'course', department: ['THEAT'], number: 222, year: 2014, semester: 1},
            {$type: 'course', department: ['THEAT'], number: 222, year: 2014, semester: 3},
        ]

        expect(computeOccurrence(expr, courses)).to.be.true
    })
})
