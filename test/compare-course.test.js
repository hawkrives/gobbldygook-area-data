import compareCourse from '../lib/compare-course'

describe('compareCourse', () => {
    it('compares select keys of courses', () => {
        expect(compareCourse({department: ['ART'], number: 310}, {department: ['ART'], number: 310}))
            .to.be.true
    })

    it('compares empty objects to be equal', () => {
        expect(compareCourse({}, {})).to.be.true
    })

    describe('compares the "department" prop', () => {
        it('the same department is equal to itself', () => {
            expect(compareCourse({department: ['ART']}, {department: ['ART']}))
                .to.be.true
        })

        it('multiple departments are not the same as a single department', () => {
            expect(compareCourse({department: ['ART']}, {department: ['ART', 'ASIAN']}))
                .to.be.false
        })

        it('different departments are not equal', () => {
            expect(compareCourse({department: ['ASIAN']}, {department: ['ART']}))
                .to.be.false
        })

        it('order is significant', () => {
            expect(compareCourse({department: ['CHEM', 'BIO']}, {department: ['BIO', 'CHEM']}))
                .to.be.false
        })
    })

    describe('compares the "semester" prop', () => {
        it('the same semester is equal to itself', () => {
            expect(compareCourse({semester: 1}, {semester: 1})).to.be.true
        })

        it('different semesters are not equal', () => {
            expect(compareCourse({semester: 2}, {semester: 1})).to.be.false
        })
    })

    describe('compares the "year" prop', () => {
        it('the same year is equal to itself', () => {
            expect(compareCourse({year: 2014}, {year: 2014})).to.be.true
        })

        it('different years are not equal', () => {
            expect(compareCourse({year: 2014}, {year: 2015})).to.be.false
        })
    })

    describe('compares the "number" prop', () => {
        it('the same number is equal to itself', () => {
            expect(compareCourse({number: 201}, {number: 201})).to.be.true
        })
        it('zero is equal', () => {
            expect(compareCourse({number: 0}, {number: 0})).to.be.true
        })
        it('zero equals negative zero', () => {
            expect(compareCourse({number: 0}, {number: -0})).to.be.true
        })
        it('zero is not one', () => {
            expect(compareCourse({number: 0}, {number: 1})).to.be.false
        })
        it('infinity is not negative infinity', () => {
            expect(compareCourse({number: Infinity}, {number: -Infinity})).to.be.false
        })
        it('infinity equals infinity', () => {
            expect(compareCourse({number: Infinity}, {number: Infinity})).to.be.true
        })
    })

    describe('compares the "level" prop', () => {
        it('the same level is equal to itself', () => {
            expect(compareCourse({level: 100}, {level: 100})).to.be.true
        })
        it('different levels are different', () => {
            expect(compareCourse({level: 100}, {level: 200})).to.be.false
        })
    })

    describe('compares the "international" prop', () => {
        it('the same "international" value is equal', () => {
            expect(compareCourse({international: true}, {international: true})).to.be.true
        })
        it('different values are different', () => {
            expect(compareCourse({international: true}, {international: false})).to.be.false
        })
    })

    describe('compares the "lab" prop', () => {
        it('the same "lab" value is equal', () => {
            expect(compareCourse({lab: true}, {lab: true})).to.be.true
        })
        it('different "lab" values are different', () => {
            expect(compareCourse({lab: true}, {lab: false})).to.be.false
        })
    })

    describe('compares the "section" prop', () => {
        it('the same section is equal', () => {
            expect(compareCourse({section: 'A'}, {section: 'A'})).to.be.true
        })
        it('different sections are different', () => {
            expect(compareCourse({section: 'A'}, {section: 'B'})).to.be.false
        })
    })
})
