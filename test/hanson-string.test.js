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

        xit('parses courses with no departments after an prior department', () => {
            parse('CSCI 121')
            const c2 = parse('125')
            expect(c2).to.deep.equal({
                $type: 'course',
                department: ['CSCI'],
                number: 125,
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
    })

})
