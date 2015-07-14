xit('computes the boolean result of and-clauses', () => {})
    xit('computes the boolean result of or-clauses', () => {})
    it('only computes an or-clause until it has a result', () => {
        const clause = parse('CSCI 121 | 125')
        const requirement = {result: clause}
        const courses = [{department: ['CSCI'], number: 121}, {department: ['CSCI'], number: 125}]

        const result = computeBoolean(clause, requirement, courses)
        expect(clause).to.deep.equal({
            $type: 'boolean',
            $or: [
                {_result: true, $type: 'course', department: ['CSCI'], number: 121},
                {$type: 'course', department: ['CSCI'], number: 125},
            ],
            _matches: [
                {_result: true, $type: 'course', department: ['CSCI'], number: 121},
            ],
        })
        expect(result).to.be.true
    })

    it('computes an or-clause even if the first item is false', () => {
        const clause = parse('CSCI 121 | 125')
        const requirement = {result: clause}
        const courses = [{department: ['CSCI'], number: 151}, {department: ['CSCI'], number: 125}]

        const result = computeBoolean(clause, requirement, courses)
        expect(clause).to.deep.equal({
            $type: 'boolean',
            $or: [
                {_result: false, $type: 'course', department: ['CSCI'], number: 121},
                {_result: true, $type: 'course', department: ['CSCI'], number: 125},
            ],
            _matches: [
                {_result: true, $type: 'course', department: ['CSCI'], number: 125},
            ],
        })
        expect(result).to.be.true
    })
