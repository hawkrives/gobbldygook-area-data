import collectMatches from '../lib/collect-matches'

describe.only('collectMatches', () => {
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
    it('collects matches from boolean expressions')
    it('collects matches from course expressions')
    it('collects matches from modifiers')
    it('collects matches from occurrences')
    it('collects matches from of-expressions')
    it('collects matches from where-expressions')
    it('collects matches from requirement references')
})
