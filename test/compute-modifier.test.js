import computeChunk, {computeModifier} from '../lib/compute-chunk'
import applyFilter from '../lib/apply-filter'

describe('computeModifier', () => {
    it('checks for <things> from all children', () => {
        const modifier = {
            $type: 'modifier',
            $count: 1,
            $what: 'course',
            $from: 'children',
            $children: '$all',
        }

        const req = {
            Bible: {
                $type: 'boolean',
                $or: [
                    {$type: 'course', department: ['REL'], number: 111},
                    {$type: 'course', department: ['REL'], number: 112},
                    {$type: 'course', department: ['REL'], number: 251},
                ],
            },
            result: modifier,
        }

        const courses = [
            {department: ['REL'], number: 111},
            {department: ['REL'], number: 112},
            {department: ['CSCI'], number: 251},
        ]

        computeChunk(req.Bible, req, courses)

        const result = computeModifier(modifier, req, courses)
        expect(req).to.deep.equal({
            ...req,
            result: {
                ...modifier,
                _counted: 1,
                _matches: [{$type: 'course', _result: true, department: ['REL'], number: 111}],
            },
        })
        expect(result).to.be.true
    })

    it('checks for <things> from specified children', () => {
        const modifier = {
            $type: 'modifier',
            $count: 1,
            $what: 'course',
            $from: 'children',
            $children: [{$type: 'reference', $requirement: 'Bible'}],
        }

        const req = {
            Bible: {
                $type: 'boolean',
                $or: [
                    {$type: 'course', department: ['REL'], number: 111},
                    {$type: 'course', department: ['REL'], number: 112},
                    {$type: 'course', department: ['REL'], number: 251},
                ],
            },
            result: modifier,
        }

        const courses = [
            {department: ['REL'], number: 111},
            {department: ['REL'], number: 112},
            {department: ['CSCI'], number: 251},
        ]

        computeChunk(req.Bible, req, courses)

        const result = computeModifier(modifier, req, courses)
        expect(req).to.deep.equal({
            ...req,
            result: {
                ...modifier,
                _counted: 1,
                _matches: [{$type: 'course', _result: true, department: ['REL'], number: 111}],
            },
        })
        expect(result).to.be.true
    })

    it('checks for <things> from the filter', () => {
        const modifier = {
            $type: 'modifier',
            $count: 1,
            $what: 'course',
            $from: 'filter',
        }

        const req = {
            filter: {
                $type: 'filter',
                $where: {
                    $type: 'qualification',
                    $key: 'department',
                    $value: {$eq: 'REL', $type: 'operator'},
                },
            },
            result: modifier,
        }

        let courses = [
            {department: ['REL'], number: 111},
            {department: ['REL'], number: 112},
            {department: ['CSCI'], number: 251},
        ]

        courses = applyFilter(req.filter, courses)
        computeChunk(req.filter, req, courses)

        const result = computeModifier(modifier, req, courses)
        expect(req).to.deep.equal({
            ...req,
            result: {
                ...modifier,
                _counted: 2,
                _matches: [
                    {department: ['REL'], number: 111},
                    {department: ['REL'], number: 112},
                ],
            },
        })
        expect(result).to.be.true
    })

    it('checks for <things> from the given where-clause', () => {
        const modifier = {
            $type: 'modifier',
            $count: 1,
            $what: 'course',
            $from: 'where',
            $where: {
                $type: 'qualification',
                $key: 'department',
                $value: {
                    $eq: 'REL',
                    $type: 'operator',
                },
            },
        }

        const req = {result: modifier}

        let courses = [
            {department: ['REL'], number: 111},
            {department: ['REL'], number: 112},
            {department: ['CSCI'], number: 251},
        ]

        computeChunk(req.result, req, courses)

        const result = computeModifier(modifier, req, courses)

        expect(req).to.deep.equal({
            ...req,
            result: {
                ...modifier,
                _counted: 2,
                _matches: [
                    {department: ['REL'], number: 111},
                    {department: ['REL'], number: 112},
                ],
            },
        })
        expect(result).to.be.true
    })

    describe('supports counting <thing>, where <thing> is', () => {
        it('courses', () => {
            const modifier = {
                $type: 'modifier',
                $count: 3,
                $what: 'course',
                $from: 'children',
                $children: '$all',
            }

            const req = {
                Bible: {
                    $type: 'boolean',
                    $and: [
                        {$type: 'course', department: ['REL'], number: 111},
                        {$type: 'course', department: ['REL'], number: 112},
                    ],
                },
                A: {$type: 'course', department: ['CSCI'], number: 251},
                result: modifier,
            }

            const courses = [
                {department: ['REL'], number: 111, credits: 1.0},
                {department: ['REL'], number: 112, credits: 1.0},
                {department: ['CSCI'], number: 251, credits: 1.0},
            ]

            computeChunk(req.Bible, req, courses)
            computeChunk(req.A, req, courses)

            const result = computeModifier(modifier, req, courses)
            expect(req).to.deep.equal({
                ...req,
                result: {
                    ...modifier,
                    _counted: 3,
                    _matches: [
                        {$type: 'course', _result: true, credits: 1, department: ['REL'], number: 111},
                        {$type: 'course', _result: true, credits: 1, department: ['REL'], number: 112},
                        {$type: 'course', _result: true, credits: 1, department: ['CSCI'], number: 251},
                    ],
                },
            })
            expect(result).to.be.true
        })

        it('departments', () => {
            const modifier = {
                $type: 'modifier',
                $count: 3,
                $what: 'department',
                $from: 'children',
                $children: '$all',
            }

            const req = {
                CHBI: {
                    $type: 'boolean',
                    $and: [
                        {$type: 'course', department: ['CHEM', 'BIO'], number: 111},
                        {$type: 'course', department: ['CHEM', 'BIO'], number: 112},
                    ],
                },
                A: {$type: 'course', department: ['CSCI'], number: 251},
                result: modifier,
            }

            const courses = [
                {department: ['CHEM', 'BIO'], number: 111, credits: 1.0},
                {department: ['CHEM', 'BIO'], number: 112, credits: 1.0},
                {department: ['CSCI'], number: 251, credits: 1.0},
            ]

            computeChunk(req.CHBI, req, courses)
            computeChunk(req.A, req, courses)

            const result = computeModifier(modifier, req, courses)
            expect(req).to.deep.equal({
                ...req,
                result: {
                    ...modifier,
                    _counted: 3,
                    _matches: [
                        {$type: 'course', _result: true, credits: 1, department: ['CHEM', 'BIO'], number: 111},
                        {$type: 'course', _result: true, credits: 1, department: ['CHEM', 'BIO'], number: 112},
                        {$type: 'course', _result: true, credits: 1, department: ['CSCI'], number: 251},
                    ],
                },
            })
            expect(result).to.be.true
        })

        it('credits', () => {
            const modifier = {
                $type: 'modifier',
                $count: 2,
                $what: 'credit',
                $from: 'children',
                $children: '$all',
            }

            const req = {
                Bible: {
                    $type: 'boolean',
                    $or: [
                        {$type: 'course', department: ['REL'], number: 111},
                        {$type: 'course', department: ['REL'], number: 112},
                        {$type: 'course', department: ['REL'], number: 251},
                    ],
                },
                A: {$type: 'course', department: ['CSCI'], number: 251},
                result: modifier,
            }

            const courses = [
                {department: ['REL'], number: 111, credits: 1.0},
                {department: ['REL'], number: 112, credits: 1.0},
                {department: ['CSCI'], number: 251, credits: 1.0},
            ]

            computeChunk(req.Bible, req, courses)
            computeChunk(req.A, req, courses)

            const result = computeModifier(modifier, req, courses)
            expect(req).to.deep.equal({
                ...req,
                result: {
                    ...modifier,
                    _counted: 2,
                    _matches: [
                        {$type: 'course', _result: true, credits: 1, department: ['REL'], number: 111},
                        {$type: 'course', _result: true, credits: 1, department: ['CSCI'], number: 251},
                    ],
                },
            })
            expect(result).to.be.true
        })
    })

    it('can be used to ensure that the student has taken two courses across two departments', () => {
        const modifier = {
            $type: 'boolean',
            $and: [
                {
                    $type: 'modifier',
                    $count: 2,
                    $what: 'course',
                    $from: 'children',
                    $children: '$all',
                },
                {
                    $type: 'modifier',
                    $count: 2,
                    $what: 'department',
                    $from: 'children',
                    $children: '$all',
                },
            ],
        }

        const req = {
            A: {$type: 'course', department: ['CHEM', 'BIO'], number: 111},
            B: {$type: 'course', department: ['CHEM', 'BIO'], number: 112},
            result: modifier,
        }

        const courses = [
            {department: ['CHEM', 'BIO'], number: 111, credits: 1.0},
            {department: ['CHEM', 'BIO'], number: 112, credits: 1.0},
        ]

        computeChunk(req.A, req, courses)
        computeChunk(req.B, req, courses)
        const resultCourse = computeModifier(modifier.$and[0], req, courses)
        const resultDepartment = computeModifier(modifier.$and[1], req, courses)

        expect(req).to.deep.equal({
            ...req,
            result: {
                ...modifier,
            },
        })
        expect(resultCourse).to.be.true
        expect(resultDepartment).to.be.true
    })
})
