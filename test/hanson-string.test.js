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

        it('requires the lab to be immediately after the number', () => {
            expect(() => parse('CHEM 125 L')).to.throw('Expected "&", "|" or end of input but "L" found.')
            expect(() => parse('CHEM 125IL')).to.not.throw()
            expect(() => parse('CHEM 125L')).to.not.throw()
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

    xdescribe('counters', () => {
        xit('n may be in english from "zero" to "twenty"', () => {})
        xit('n may be a number from 0 to (at least) 999', () => {})
    })

    describe('of-statements', () => {
        xit('supports of statements of the form "n of ()"', () => {})
        xit('allows "n" to be a number', () => {})
        xit('allows "n" to be a counter', () => {})
        xit('allows "n" to be "all"', () => {})
        it('if n is "all", it is the number of items in the of-parens', () => {
            expect(parse('all of (A, B, C)')).to.deep.equal({
              "$type": "of",
              "$count": 3,
              "$of": [
                {
                  "$type": "reference",
                  "$requirement": "A"
                },
                {
                  "$type": "reference",
                  "$requirement": "B"
                },
                {
                  "$type": "reference",
                  "$requirement": "C"
                }
              ]
            })
        })
        xit('allows "n" to be "any"', () => {})
        xit('allows "n" to be "none"', () => {})

        xit('supports boolean statements within the parens', () => {})
        it('supports courses within the parens', () => {
            expect(parse('one of (CSCI 121)')).to.deep.equal({
                $type: 'of',
                $count: 1,
                $of: [
                    {
                        $type: 'course',
                        department: ['CSCI'],
                        number: 121,
                    },
                ],
            })
        })
        xit('supports where-clauses within the parens', () => {})
        xit('supports occurrences within the parens', () => {})
        xit('supports references within the parens', () => {})
        xit('supports modifiers within the parens', () => {})

        xit('requires that items be seperated by commas', () => {})
        it('supports trailing commas', () => {
            expect(parse('one of (121,)')).to.deep.equal({
                $type: 'of',
                $count: 1,
                $of: [
                    {
                        $type: 'course',
                        number: 121,
                    },
                ],
            })
        })

        it('throws an error if more items are required than are provided', () => {
            expect(() => parse('three of (CSCI 121, 125)')).to.throw('you requested 3 items, but only listed 2 options ([{"$type":"course","department":["CSCI"],"number":121},{"$type":"course","department":["CSCI"],"number":125}])')
        })
    })
    xdescribe('where-statements', () => {
        xdescribe('qualifications', () => {
            xit('can be separated by &', () => {})
            xit('can be separated by |', () => {})
            xit('can used in boolean logic: a & b | c', () => {})
            xit('can used in boolean logic: a | b & c', () => {})
            it('boolean logic can be overridden by parens: (a | b) & c', () => {
                expect(parse('four courses where { dept = THEAT & (num = 233 | num = 253) }')).to.deep.equal({
                    $type: 'where',
                    $count: 4,
                    $where: {
                        $type: 'boolean',
                        $and: [
                            {
                                $type: 'qualification',
                                $key: 'dept',
                                $value: {
                                    $eq: 'THEAT',
                                    $type: 'operator',
                                },
                            },
                            {
                                $type: 'boolean',
                                $or: [
                                    {
                                        $type: 'qualification',
                                        $key: 'num',
                                        $value: {
                                            $eq: '233',
                                            $type: 'operator',
                                        },
                                    },
                                    {
                                        $type: 'qualification',
                                        $key: 'num',
                                        $value: {
                                            $eq: '253',
                                            $type: 'operator',
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                })
            })
            xit('key must be a string', () => {})
            xit('value may include numbers', () => {})
            xit('value may include hyphens', () => {})
            xit('value may include underscores', () => {})

            xit('value may rely on a nested qualifier', () => {})
            it('function may include a space between the name and the paren', () => {
                expect(parse('one course where { year = max (year) from courses where {gereqs=year} }')).to.deep.equal({
                    $type: 'where',
                    $count: 1,
                    $where: {
                        $type: 'qualification',
                            $key: 'year',
                            $value: {
                            $eq: {
                                $name: 'max',
                                $prop: 'year',
                                $type: 'function',
                                $where: {
                                    $type: 'qualification',
                                    $key: 'gereqs',
                                    $value: {
                                        $eq: 'year',
                                        $type: 'operator',
                                    },
                                },
                            },
                            $type: 'operator',
                        },
                    },
                })
            })
            it('function may not include a space between the name and the paren', () => {
                expect(parse('one course where { year = max(year) from courses where {gereqs=year} }')).to.deep.equal({
                    $type: 'where',
                    $count: 1,
                    $where: {
                        $type: 'qualification',
                            $key: 'year',
                            $value: {
                            $eq: {
                                $name: 'max',
                                $prop: 'year',
                                $type: 'function',
                                $where: {
                                    $type: 'qualification',
                                    $key: 'gereqs',
                                    $value: {
                                        $eq: 'year',
                                        $type: 'operator',
                                    },
                                },
                            },
                            $type: 'operator',
                        },
                    },
                })
            })
            xit('value may be compared by any of =, ==, !=, <, <=, >, or >=', () => {})
        })
    })
    xdescribe('occurrences', () => {
        xit('requires a course to check for occurrences of', () => {})
    })
    xdescribe('references', () => {
        xit('can reference a requirement', () => {})
        xit('requirement titles may include [A-Z], [0-9], [-_], and ()', () => {})
    })
    xdescribe('modifiers', () => {
        xit('can count courses', () => {})
        xit('can count credits', () => {})
        xit('can count departments', () => {})
        xit('will only count departments from children', () => {})
        xit('can count from children', () => {})
        xit('can count from filter', () => {})
        xit('can count from where-statement', () => {})
    })
})
