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
            A: {$type: 'requirement', result: {$type: 'course', $course: {department: ['ART'], number: 120}}},
            C: {$type: 'requirement', result: {
                $count: 2,
                $of: [
                    {$type: 'course', $course: {department: ['ART'], number: 103}},
                    {$type: 'course', $course: {department: ['ART'], number: 104}},
                    {$type: 'course', $course: {department: ['ART'], number: 105}},
                ],
                $type: 'of',
            }},
            result: clause,
        }

        const courses = [
            {department: ['ART'], number: 120, credits: 1.0},
            {department: ['ART'], number: 104, credits: 1.0},
            {department: ['ART'], number: 105, credits: 1.0},
        ]
        const dirty = new Set()

        requirement.A.computed = computeChunk({expr: requirement.A.result, ctx: requirement, courses, dirty})
        requirement.C.computed = computeChunk({expr: requirement.C.result, ctx: requirement, courses, dirty})

        const {computedResult, matches} = computeBoolean({expr: clause, ctx: requirement, courses, dirty})
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

    it('can compute the result of several occurrence expressions', () => {
        const clause = {
            $or: [
                {
                    $count: 1,
                    $course: {department: ['THEAT'], number: 222},
                    $type: 'occurrence',
                },
                {
                    $count: 3,
                    $course: {department: ['THEAT'], number: 266},
                    $type: 'occurrence',
                },
            ],
            $type: 'boolean',
        }

        const requirement = {result: clause}

        const courses = [
            {department: ['THEAT'], number: 266, year: 2014, semester: 1},
            {department: ['THEAT'], number: 266, year: 2014, semester: 3},
            {department: ['THEAT'], number: 266, year: 2015, semester: 1},
        ]

        const {computedResult, matches} = computeBoolean({expr: clause, ctx: requirement, courses, dirty: new Set()})
        expect(clause).to.deep.equal({
            $or: [
                {
                    $count: 1,
                    $course: {department: ['THEAT'], number: 222},
                    $type: 'occurrence',
                    _result: false,
                    _counted: 0,
                    _matches: [],
                },
                {
                    $count: 3,
                    $course: {department: ['THEAT'], number: 266},
                    $type: 'occurrence',
                    _result: true,
                    _counted: 3,
                    _matches: [
                        {department: ['THEAT'], number: 266, year: 2014, semester: 1},
                        {department: ['THEAT'], number: 266, year: 2014, semester: 3},
                        {department: ['THEAT'], number: 266, year: 2015, semester: 1},
                    ],
                },
            ],
            $type: 'boolean',
        })
        expect(computedResult).to.be.true
        expect(matches).to.deep.equal([
            {department: ['THEAT'], number: 266, year: 2014, semester: 1},
            {department: ['THEAT'], number: 266, year: 2014, semester: 3},
            {department: ['THEAT'], number: 266, year: 2015, semester: 1},
        ])
    })

    it('can compute the result of several requirement references')
    it('can compute the result of several of-expressions', () => {
        const clause = {
            $and: [
                {
                    $count: 1,
                    $of: [
                        {
                            $course: {department: ['CSCI'], number: 121},
                            $type: 'course',
                        },
                        {
                            $course: {department: ['CSCI'], number: 125},
                            $type: 'course',
                        },
                    ],
                    $type: 'of',
                },
                {
                    $count: 1,
                    $of: [
                        {
                            $course: {department: ['ART'], number: 102},
                            $type: 'course',
                        },
                        {
                            $course: {department: ['ART'], number: 103},
                            $type: 'course',
                        },
                    ],
                    $type: 'of',
                },
            ],
            $type: 'boolean',
        }

        const requirement = {result: clause}

        const courses = [
            {department: ['CSCI'], number: 125},
            {department: ['ART'], number: 102},
        ]

        const {computedResult, matches} = computeBoolean({expr: clause, ctx: requirement, courses, dirty: new Set()})
        expect(clause).to.deep.equal({
            $and: [
                {
                    $count: 1,
                    $of: [
                        {_result: false, $course: {department: ['CSCI'], number: 121}, $type: 'course'},
                        {_result: true, $course: {department: ['CSCI'], number: 125}, $type: 'course'},
                    ],
                    $type: 'of',
                    _counted: 1,
                    _matches: [
                        {_result: true, $course: {department: ['CSCI'], number: 125}, $type: 'course'},
                    ],
                    _result: true,
                },
                {
                    $count: 1,
                    $of: [
                        {_result: true, $course: {department: ['ART'], number: 102}, $type: 'course'},
                        {_result: false, $course: {department: ['ART'], number: 103}, $type: 'course'},
                    ],
                    $type: 'of',
                    _counted: 1,
                    _matches: [
                        {_result: true, $course: {department: ['ART'], number: 102}, $type: 'course'},
                    ],
                    _result: true,
                },
            ],
            $type: 'boolean',
        })
        expect(computedResult).to.be.true
        expect(matches).to.deep.equal([
            {_result: true, $type: 'course', $course: {department: ['CSCI'], number: 125}},
            {_result: true, $type: 'course', $course: {department: ['ART'], number: 102}},
        ])
    })

    it('can compute the result of several where-expressions')
})
