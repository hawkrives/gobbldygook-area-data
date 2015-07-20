import computeChunk, {computeBoolean} from '../lib/compute-chunk'

describe('computeBoolean', () => {
    it('computes the boolean result of and-clauses', () => {
        const clause = {
            $type: 'boolean',
            $and: [
                {$type: 'course', $course: {department: ['CSCI'], number: 121}},
                {$type: 'course', $course: {department: ['CSCI'], number: 125}},
            ],
        }
        const requirement = {result: clause}
        const courses = [
            {department: ['CSCI'], number: 121},
            {department: ['CSCI'], number: 125},
        ]

        const {computedResult, matches} = computeBoolean({expr: clause, ctx: requirement, courses, dirty: new Set()})
        expect(clause).to.deep.equal({
            $type: 'boolean',
            $and: [
                {_result: true, $type: 'course', $course: {department: ['CSCI'], number: 121}},
                {_result: true, $type: 'course', $course: {department: ['CSCI'], number: 125}},
            ],
        })
        expect(computedResult).to.be.true
        expect(matches).to.deep.equal([
            {_result: true, $type: 'course', $course: {department: ['CSCI'], number: 121}},
            {_result: true, $type: 'course', $course: {department: ['CSCI'], number: 125}},
        ])
    })

    it('computes the boolean result of or-clauses', () => {
        const clause = {
            $type: 'boolean',
            $or: [
                {$type: 'course', $course: {department: ['CSCI'], number: 121}},
                {$type: 'course', $course: {department: ['CSCI'], number: 125}},
            ],
        }
        const requirement = {result: clause}
        const courses = [
            {department: ['CSCI'], number: 121},
            {department: ['CSCI'], number: 125},
        ]

        const {computedResult, matches} = computeBoolean({expr: clause, ctx: requirement, courses, dirty: new Set()})
        expect(clause).to.deep.equal({
            $type: 'boolean',
            $or: [
                {_result: true, $type: 'course', $course: {department: ['CSCI'], number: 121}},
                {$type: 'course', $course: {department: ['CSCI'], number: 125}},
            ],
        })
        expect(computedResult).to.be.true
        expect(matches).to.deep.equal([
            {_result: true, $type: 'course', $course: {department: ['CSCI'], number: 121}},
        ])
    })

    it('only computes an or-clause until it has a result', () => {
        const clause = {
            $type: 'boolean',
            $or: [
                {$type: 'course', $course: {department: ['CSCI'], number: 121}},
                {$type: 'course', $course: {department: ['CSCI'], number: 125}},
            ],
        }
        const requirement = {result: clause}
        const courses = [
            {department: ['CSCI'], number: 121},
            {department: ['CSCI'], number: 125},
        ]

        const {computedResult, matches} = computeBoolean({expr: clause, ctx: requirement, courses, dirty: new Set()})
        expect(clause).to.deep.equal({
            $type: 'boolean',
            $or: [
                {_result: true, $type: 'course', $course: {department: ['CSCI'], number: 121}},
                {$type: 'course', $course: {department: ['CSCI'], number: 125}},
            ],
        })
        expect(computedResult).to.be.true
        expect(matches).to.deep.equal([
            {_result: true, $type: 'course', $course: {department: ['CSCI'], number: 121}},
        ])
    })

    it('computes an or-clause even if the first item is false', () => {
        const clause = {
            $type: 'boolean',
            $or: [
                {$type: 'course', $course: {department: ['CSCI'], number: 121}},
                {$type: 'course', $course: {department: ['CSCI'], number: 125}},
            ],
        }
        const requirement = {result: clause}
        const courses = [
            {department: ['CSCI'], number: 151},
            {department: ['CSCI'], number: 125},
        ]

        const {computedResult, matches} = computeBoolean({expr: clause, ctx: requirement, courses, dirty: new Set()})
        expect(clause).to.deep.equal({
            $type: 'boolean',
            $or: [
                {_result: false, $type: 'course', $course: {department: ['CSCI'], number: 121}},
                {_result: true, $type: 'course', $course: {department: ['CSCI'], number: 125}},
            ],
        })
        expect(computedResult).to.be.true
        expect(matches).to.deep.equal([
            {_result: true, $type: 'course', $course: {department: ['CSCI'], number: 125}},
        ])
    })

    it('can compute the result of several other boolean expressions', () => {
        const clause = {
            $type: 'boolean',
            $and: [
                {
                    $type: 'boolean',
                    $or: [
                        {$type: 'course', $course: {department: ['CSCI'], number: 121}},
                        {$type: 'course', $course: {department: ['CSCI'], number: 125}},
                    ],
                },
                {
                    $type: 'boolean',
                    $or: [
                        {$type: 'course', $course: {department: ['CSCI'], number: 130}},
                        {$type: 'course', $course: {department: ['CSCI'], number: 131}},
                    ],
                },
            ],
        }
        const requirement = {result: clause}

        const courses = [
            {department: ['CSCI'], number: 130},
            {department: ['CSCI'], number: 125},
        ]

        const {computedResult, matches} = computeBoolean({expr: clause, ctx: requirement, courses, dirty: new Set()})
        expect(clause).to.deep.equal({
            $and: [
                {
                    $or: [
                        {_result: false, $type: 'course', $course: {department: ['CSCI'], number: 121}},
                        {_result: true, $type: 'course', $course: {department: ['CSCI'], number: 125}},
                    ],
                    $type: 'boolean',
                    _result: true,
                    _matches: [
                        {_result: true, $type: 'course', $course: {department: ['CSCI'], number: 125}},
                    ],
                },
                {
                    $or: [
                        {_result: true, $type: 'course', $course: {department: ['CSCI'], number: 130}},
                        {$type: 'course', $course: {department: ['CSCI'], number: 131}},
                    ],
                    $type: 'boolean',
                    _result: true,
                    _matches: [
                        {_result: true, $type: 'course', $course: {department: ['CSCI'], number: 130}},
                    ],
                },
            ],
            $type: 'boolean',
        })
        expect(computedResult).to.be.true
        expect(matches).to.deep.equal([
            {_result: true, $type: 'course', $course: {department: ['CSCI'], number: 125}},
            {_result: true, $type: 'course', $course: {department: ['CSCI'], number: 130}},
        ])
    })

    it('can compute the result of several course expressions', () => {
        const clause = {
            $or: [
                {$type: 'course', $course: {department: ['CSCI'], number: 121}},
                {$type: 'course', $course: {department: ['CSCI'], number: 125}},
            ],
            $type: 'boolean',
        }
        const requirement = {result: clause}

        const courses = [
            {department: ['CSCI'], number: 130},
            {department: ['CSCI'], number: 125},
        ]

        const {computedResult, matches} = computeBoolean({expr: clause, ctx: requirement, courses, dirty: new Set()})
        expect(clause).to.deep.equal({
            $or: [
                {_result: false, $type: 'course', $course: {department: ['CSCI'], number: 121}},
                {_result: true, $type: 'course', $course: {department: ['CSCI'], number: 125}},
            ],
            $type: 'boolean',
        })
        expect(computedResult).to.be.true
        expect(matches).to.deep.equal([
            {_result: true, $type: 'course', $course: {department: ['CSCI'], number: 125}},
        ])
    })

    it('can compute the result of several modifier expressions', () => {
        const clause = {
            $and: [
                {
                    $children: '$all',
                    $count: 3,
                    $from: 'children',
                    $type: 'modifier',
                    $what: 'course',
                },
                {
                    $children: [
                        {
                            $requirement: 'A',
                            $type: 'reference',
                        },
                        {
                            $requirement: 'C',
                            $type: 'reference',
                        },
                    ],
                    $count: 2,
                    $from: 'children',
                    $type: 'modifier',
                    $what: 'credit',
                },
            ],
            $type: 'boolean',
        }
        const requirement = {
            A: {$type: 'course', $course: {department: ['ART'], number: 120}},
            C: {
                $count: 2,
                $of: [
                    {$type: 'course', $course: {department: ['ART'], number: 103}},
                    {$type: 'course', $course: {department: ['ART'], number: 104}},
                    {$type: 'course', $course: {department: ['ART'], number: 105}},
                ],
                $type: 'of',
            },
            result: clause,
        }

        const courses = [
            {department: ['ART'], number: 120, credits: 1.0},
            {department: ['ART'], number: 104, credits: 1.0},
            {department: ['ART'], number: 105, credits: 1.0},
        ]
        const dirty = new Set()

        computeChunk({expr: requirement.A, ctx: requirement, courses, dirty})
        computeChunk({expr: requirement.C, ctx: requirement, courses, dirty})

        const {computedResult, matches} = computeBoolean({expr: clause, ctx: requirement, courses, dirty: new Set()})
        expect(clause).to.deep.equal({
            $and: [
                {
                    $children: '$all',
                    $count: 3,
                    $from: 'children',
                    $type: 'modifier',
                    $what: 'course',
                    _result: true,
                    _counted: 3,
                    _matches: [
                        {$type: 'course', _result: true, $course: {department: ['ART'], number: 120, credits: 1.0}},
                        {$type: 'course', _result: true, $course: {department: ['ART'], number: 104, credits: 1.0}},
                        {$type: 'course', _result: true, $course: {department: ['ART'], number: 105, credits: 1.0}},
                    ],
                },
                {
                    $children: [
                        {$requirement: 'A', $type: 'reference'},
                        {$requirement: 'C', $type: 'reference'},
                    ],
                    $count: 2,
                    $from: 'children',
                    $type: 'modifier',
                    $what: 'credit',
                    _result: true,
                    _counted: 3,
                    _matches: [
                        {$type: 'course', _result: true, $course: {department: ['ART'], number: 120, credits: 1.0}},
                        {$type: 'course', _result: true, $course: {department: ['ART'], number: 104, credits: 1.0}},
                        {$type: 'course', _result: true, $course: {department: ['ART'], number: 105, credits: 1.0}},
                    ],
                },
            ],
            $type: 'boolean',
        })
        expect(computedResult).to.be.true
        expect(matches).to.deep.equal([
            {$type: 'course', _result: true, $course: {department: ['ART'], number: 120, credits: 1.0}},
            {$type: 'course', _result: true, $course: {department: ['ART'], number: 104, credits: 1.0}},
            {$type: 'course', _result: true, $course: {department: ['ART'], number: 105, credits: 1.0}},
        ])
    })

    it('can compute the result of several occurrence expressions')
    it('can compute the result of several of-expressions')
    it('can compute the result of several requirement references')
    it('can compute the result of several where-expressions')
})
