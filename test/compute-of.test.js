import {computeOf} from '../lib/compute-chunk'

describe('computeOf', () => {
    it('computes a list of boolean-equivalent expressions against a desired count', () => {
        const expr = {
            $type: 'of',
            $count: 2,
            $of: [
                {$type: 'course', department: ['CSCI'], number: 121},
                {$type: 'course', department: ['CSCI'], number: 125},
                {$type: 'course', department: ['CSCI'], number: 150},
            ],
        }
        const req = {
            $type: 'requirement',
            result: expr,
        }

        const courses = [
            {department: ['CSCI'], number: 121},
            {department: ['CSCI'], number: 125},
        ]

        const expectedResult = {
            $type: 'of',
            $count: 2,
            _counted: 2,
            _matches: [
                {_result: true, $type: 'course', department: ['CSCI'], number: 121},
                {_result: true, $type: 'course', department: ['CSCI'], number: 125},
            ],
            $of: [
                {_result: true, $type: 'course', department: ['CSCI'], number: 121},
                {_result: true, $type: 'course', department: ['CSCI'], number: 125},
                {_result: false, $type: 'course', department: ['CSCI'], number: 150},
            ],
        }

        expect(computeOf(expr, req, courses)).to.be.true
        expect(expr).to.deep.equal(expectedResult)
    })

    it('stores the number of matches in its containing expression')

    it('handles counting boolean expressions')
    it('handles counting course expressions')
    it('handles counting modifier expressions')
    it('handles counting occurrence expressions')
    it('handles counting nested of-expressions')
    it('handles counting requirement references')
    it('handles counting where-expressions')
})
