import collectMatches from '../lib/collect-matches'

describe('collectMatches', () => {
    it('collects matches from child requirements', () => {
        const expr = {
            $type: 'requirement',
            result: {
                $type: 'boolean',
                $and: [
                    {
                        $type: 'reference',
                        requirement: 'Child',
                        _matches: [
                            {_result: true, $type: 'course', department: ['ASIAN'], number: 121},
                        ],
                    },
                    {
                        $type: 'reference',
                        requirement: 'Child2',
                        _matches: [
                            {_result: true, $type: 'course', department: ['CSCI'], number: 121},
                        ],
                    },
                ],
            },
        }

        expect(collectMatches(expr))
            .to.deep.equal([
                {_result: true, $type: 'course', department: ['ASIAN'], number: 121},
                {_result: true, $type: 'course', department: ['CSCI'], number: 121},
            ])
    })

    it('collects matches from boolean expressions', () => {
        const expr = {
            $type: 'requirement',
            result: {
                $type: 'boolean',
                $and: [
                    {_result: true, $type: 'course', department: ['ASIAN'], number: 121},
                    {
                        $type: 'reference',
                        requirement: 'Child2',
                        _matches: [
                            {_result: true, $type: 'course', department: ['CSCI'], number: 121},
                        ],
                    },
                ],
            },
        }

        expect(collectMatches(expr))
            .to.deep.equal([
                {_result: true, $type: 'course', department: ['ASIAN'], number: 121},
                {_result: true, $type: 'course', department: ['CSCI'], number: 121},
            ])
    })

    it('collects matches from course expressions', () => {
        const expr = {
            $type: 'requirement',
            result: {_result: true, $type: 'course', department: ['ASIAN'], number: 121},
        }

        expect(collectMatches(expr))
            .to.deep.equal([
                {_result: true, $type: 'course', department: ['ASIAN'], number: 121},
            ])
    })

    it('collects matches from "courses" modifiers', () => {
        const expr = {
            $type: 'requirement',
            result: {
                $type: 'modifier',
                $count: 2,
                $what: 'children',
                $children: 'all',
                _matches: [
                    {_result: true, $type: 'course', department: ['ASIAN'], number: 121},
                    {_result: true, $type: 'course', department: ['CSCI'], number: 121},
                ],
            },
        }

        expect(collectMatches(expr))
            .to.deep.equal([
                {_result: true, $type: 'course', department: ['ASIAN'], number: 121},
                {_result: true, $type: 'course', department: ['CSCI'], number: 121},
            ])
    })

    it('collects matches from occurrences', () => {
        const expr = {
            $type: 'requirement',
            result: {
                $type: 'occurrence',
                // the occurrence is empty because the _matches are calculated
                // in computeOccurrence
                _matches: [
                    {_result: true, $type: 'course', department: ['ASIAN'], number: 121},
                    {_result: true, $type: 'course', department: ['ASIAN'], number: 121},
                ],
            },
        }

        expect(collectMatches(expr))
            .to.deep.equal([
                {_result: true, $type: 'course', department: ['ASIAN'], number: 121},
                {_result: true, $type: 'course', department: ['ASIAN'], number: 121},
            ])
    })

    it('collects matches from of-expressions', () => {
        const expr = {
            $type: 'requirement',
            result: {
                $type: 'of',
                $count: 1,
                $of: [
                    {
                        $type: 'boolean',
                        $and: [
                            {_result: true, $type: 'course', department: ['ASIAN'], number: 121},
                            {
                                $type: 'reference',
                                requirement: 'Child2',
                                _matches: [
                                    {_result: true, $type: 'course', department: ['CSCI'], number: 121},
                                ],
                            },
                        ],
                    },
                    {
                        $type: 'modifier',
                        $count: 2,
                        $what: 'children',
                        $children: 'all',
                        _matches: [
                            {_result: true, $type: 'course', department: ['MUSIC'], number: 121},
                            {_result: true, $type: 'course', department: ['ESTH'], number: 121},
                        ],
                    },
                ],
            },
        }

        expect(collectMatches(expr))
            .to.deep.equal([
                {_result: true, $type: 'course', department: ['ASIAN'], number: 121},
                {_result: true, $type: 'course', department: ['CSCI'], number: 121},
                {_result: true, $type: 'course', department: ['MUSIC'], number: 121},
                {_result: true, $type: 'course', department: ['ESTH'], number: 121},
            ])
    })

    it('collects matches from where-expressions', () => {
        const expr = {
            $type: 'requirement',
            result: {
                $type: 'where',
                // $where is empty because the _matches are calculated in computeWhere
                $where: {},
                _matches: [
                    {_result: true, $type: 'course', department: ['ASIAN'], number: 121},
                    {_result: true, $type: 'course', department: ['CSCI'], number: 121},
                ],
            },
        }

        expect(collectMatches(expr))
            .to.deep.equal([
                {_result: true, $type: 'course', department: ['ASIAN'], number: 121},
                {_result: true, $type: 'course', department: ['CSCI'], number: 121},
            ])
    })

    it('collects matches from requirement references', () => {
        const expr = {
            $type: 'requirement',
            result: {
                $type: 'reference',
                requirement: 'Child',
                _matches: [
                    {_result: true, $type: 'course', department: ['ASIAN'], number: 121},
                ],
            },
        }

        expect(collectMatches(expr))
            .to.deep.equal([
                {_result: true, $type: 'course', department: ['ASIAN'], number: 121},
            ])
    })
})
