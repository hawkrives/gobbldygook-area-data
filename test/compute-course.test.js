import {computeCourse} from '../lib/compute-chunk'

describe.only('computeCourse', () => {
    it('checks if a course exists in the list of courses', () => {
        const courses = [
            {$type: 'course', department: ['ASIAN', 'ART'], number: 130},
            {$type: 'course', department: ['ASIAN', 'ART'], number: 170},
            {$type: 'course', department: ['ART'], number: 250},
        ]

        const query = {department: ['ART'], number: 250}

        expect(computeCourse(query, courses)).to.be.true
        expect(query).to.deep.equal({$type: 'course', department: ['ART'], number: 250})
    })

    it('merges a query and the found course, giving precedence to the query', () => {
        const courses = [
            {$type: 'course', department: ['ASIAN', 'ART'], number: 130},
            {$type: 'course', department: ['ASIAN', 'ART'], number: 170},
            {$type: 'course', department: ['ART'], number: 250},
        ]

        const query = {department: ['ART'], number: 250, crsid: 2015}

        expect(computeCourse(query, courses)).to.be.true
        expect(query).to.deep.equal({$type: 'course', department: ['ART'], number: 250, crsid: 2015})
    })
})
