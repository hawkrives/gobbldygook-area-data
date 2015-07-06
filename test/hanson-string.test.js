import {parse} from '../lib/parse-hanson-string'

describe('parse hanson-string', () => {
    describe('course parsing', () => {
        it('parses courses with a single department', () => {
            expect(parse('CSCI 121')).to.deep.equal({
                $type: 'course',
                department: ['CSCI'],
                number: 121,
            })
        })

        it('parses courses with a two departments', () => {
            expect(parse('AS/ES 121')).to.deep.equal({
                $type: 'course',
                department: ['ASIAN', 'ENVST'],
                number: 121,
            })
        })

        it('parses courses with no departments as having no department', () => {
            expect(parse('121')).to.deep.equal({
                $type: 'course',
                number: 121,
            })
        })

        it('parses courses with sections', () => {
            expect(parse('CSCI 121.A')).to.deep.equal({
                $type: 'course',
                department: ['CSCI'],
                number: 121,
                section: 'A',
            })
        })

        it('parses courses with years', () => {
            expect(parse('CSCI 121.A.2014')).to.deep.equal({
                $type: 'course',
                department: ['CSCI'],
                number: 121,
                section: 'A',
                year: 2014,
            })
        })

        it('parses courses with semesters', () => {
            expect(parse('CSCI 121.A.2014.1')).to.deep.equal({
                $type: 'course',
                department: ['CSCI'],
                number: 121,
                section: 'A',
                year: 2014,
                semester: 1,
            })
        })

        it('requires section to be present if year is', () => {
            expect(() => parse('CSCI 121.2014')).to.throw('Expected "&", "|" or end of input but "." found.')
        })

        it('requires section and year to be present if semester is', () => {
            expect(() => parse('CSCI 121.A.5')).to.throw('Expected "&", "|" or end of input but "." found.')
            expect(() => parse('CSCI 121.5')).to.throw('Expected "&", "|" or end of input but "." found.')
        })

        it('supports wildcard sections', () => {
            expect(parse('CSCI 121.*')).to.deep.equal({
                $type: 'course',
                department: ['CSCI'],
                number: 121,
                section: '*',
            })
        })

        it('supports wildcard years', () => {
            expect(parse('CSCI 121.*.*')).to.deep.equal({
                $type: 'course',
                department: ['CSCI'],
                number: 121,
                section: '*',
                year: '*',
            })
        })

        it('supports wildcard semesters', () => {
            expect(parse('CSCI 121.*.*.*')).to.deep.equal({
                $type: 'course',
                department: ['CSCI'],
                number: 121,
                section: '*',
                year: '*',
                semester: '*',
            })
        })

        it('supports international courses', () => {
            expect(parse('CSCI 121I')).to.deep.equal({
                $type: 'course',
                department: ['CSCI'],
                number: 121,
                international: true,
            })
        })

        it('supports labs', () => {
            expect(parse('CSCI 121L')).to.deep.equal({
                $type: 'course',
                department: ['CSCI'],
                number: 121,
                lab: true,
            })
        })

        it('supports international labs', () => {
            expect(parse('CSCI 121IL')).to.deep.equal({
                $type: 'course',
                department: ['CSCI'],
                number: 121,
                international: true,
                lab: true,
            })
        })

        it('requires international labs to be in IL order', () => {
            expect(() => parse('CSCI 121LI')).to.throw('Expected "&", "|" or end of input but "I" found.')
        })
    })

    describe('boolean parsing', () => {
        it('parses courses seperated by | as being or-d', () => {
            expect(parse('CSCI 121 | CSCI 125')).to.deep.equal({
                $type: 'boolean',
                $or: [
                    {
                        $type: 'course',
                        department: ['CSCI'],
                        number: 121,
                    },
                    {
                        $type: 'course',
                        department: ['CSCI'],
                        number: 125,
                    },
                ],
            })
        })

        it('parses courses seperated by & as being and-d', () => {
            expect(parse('CSCI 121 & CSCI 125')).to.deep.equal({
                $type: 'boolean',
                $and: [
                    {
                        $type: 'course',
                        department: ['CSCI'],
                        number: 121,
                    },
                    {
                        $type: 'course',
                        department: ['CSCI'],
                        number: 125,
                    },
                ],
            })
        })

        it('parses courses with no departments after an prior department', () => {
            expect(parse('CSCI 121 | 125')).to.deep.equal({
                $type: 'boolean',
                $or: [
                    {
                        $type: 'course',
                        department: ['CSCI'],
                        number: 121,
                    },
                    {
                        $type: 'course',
                        department: ['CSCI'],
                        number: 125,
                    },
                ],
            })
        })

        it('changes departments when given a new one', () => {
            expect(parse('CSCI 121 | PSCI 125')).to.deep.equal({
                $type: 'boolean',
                $or: [
                    {
                        $type: 'course',
                        department: ['CSCI'],
                        number: 121,
                    },
                    {
                        $type: 'course',
                        department: ['PSCI'],
                        number: 125,
                    },
                ],
            })
        })

        it('allows several &-d courses in a row', () => {
            expect(parse('CSCI 121 & 125 & 126 & 123')).to.deep.equal({
                $type: 'boolean',
                $and: [
                    {
                        $type: 'course',
                        department: ['CSCI'],
                        number: 121,
                    },
                    {
                        $type: 'course',
                        department: ['CSCI'],
                        number: 125,
                    },
                    {
                        $type: 'course',
                        department: ['CSCI'],
                        number: 126,
                    },
                    {
                        $type: 'course',
                        department: ['CSCI'],
                        number: 123,
                    },
                ],
            })
        })

        it('allows several |-d courses in a row', () => {
            expect(parse('CSCI 121 | 125 | 126 | 123')).to.deep.equal({
                $type: 'boolean',
                $or: [
                    {
                        $type: 'course',
                        department: ['CSCI'],
                        number: 121,
                    },
                    {
                        $type: 'course',
                        department: ['CSCI'],
                        number: 125,
                    },
                    {
                        $type: 'course',
                        department: ['CSCI'],
                        number: 126,
                    },
                    {
                        $type: 'course',
                        department: ['CSCI'],
                        number: 123,
                    },
                ],
            })
        })

        it('keeps duplicates in a list of courses', () => {
            expect(parse('CSCI 121 | 121 | 125')).to.deep.equal({
                $type: 'boolean',
                $or: [
                    {
                        $type: 'course',
                        department: ['CSCI'],
                        number: 121,
                    },
                    {
                        $type: 'course',
                        department: ['CSCI'],
                        number: 121,
                    },
                    {
                        $type: 'course',
                        department: ['CSCI'],
                        number: 125,
                    },
                ],
            })
        })

        it('allows a & b | c – boolean logic for courses', () => {
            expect(parse('CSCI 121 & 122 | 123')).to.deep.equal({
                $type: 'boolean',
                $or: [
                    {
                        $type: 'boolean',
                        $and: [
                            {
                                $type: 'course',
                                department: ['CSCI'],
                                number: 121,
                            },
                            {
                                $type: 'course',
                                department: ['CSCI'],
                                number: 122,
                            },
                        ],
                    },
                    {
                        $type: 'course',
                        department: ['CSCI'],
                        number: 123,
                    },
                ],
            })
        })

        it('allows a | b & c – boolean logic for courses', () => {
            expect(parse('CSCI 121 | 122 & 123')).to.deep.equal({
                $type: 'boolean',
                $or: [
                    {
                        $type: 'course',
                        department: ['CSCI'],
                        number: 121,
                    },
                    {
                        $type: 'boolean',
                        $and: [
                            {
                                $type: 'course',
                                department: ['CSCI'],
                                number: 122,
                            },
                            {
                                $type: 'course',
                                department: ['CSCI'],
                                number: 123,
                            },
                        ],
                    },
                ],
            })
        })

        it('supports parentheses to control order-of-operations - (a | b) & c', () => {
            expect(parse('(CSCI 121 | 122) & 123')).to.deep.equal({
                $type: 'boolean',
                $and: [
                    {
                        $type: 'boolean',
                        $or: [
                            {
                                $type: 'course',
                                department: ['CSCI'],
                                number: 121,
                            },
                            {
                                $type: 'course',
                                department: ['CSCI'],
                                number: 122,
                            },
                        ],
                    },
                    {
                        $type: 'course',
                        department: ['CSCI'],
                        number: 123,
                    },
                ],
            })
        })
    })

})
