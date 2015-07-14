let courses = courses = [
            {department: ['REL'], number: 111},
            {department: ['REL'], number: 112},
            {department: ['CSCI'], number: 251},
        ]
    it('checks for <things> from all children', () => {
        const modifier = parse('one course from children')
        const req = {Bible: parse('REL 111 | 112 | 251'), result: modifier}

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
    xit('checks for <things> from specified children', () => {
        // const req = {
        //     Bible: {
        //         _matches: [],
        //     },
        //     $type: 'modifier',
        //     $count: 1,
        //     $what: 'course',
        //     $from: 'children',
        //     $children: [{$requirement: 'Bible', $type: 'reference'}, {$requirement: 'B', $type: 'reference'}],
        // }
        // expect(computeModifier(modifier, req, courses))
    })
    xit('checks for <things> from the filter', () => {})
    xit('checks for <things> from the given where-clause', () => {})
    tape.skip('<thing> may be one of', () => {
        it('course')
        it('department')
        it('credit', () => {

        })
    })
