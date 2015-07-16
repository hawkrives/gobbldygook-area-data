import compareCourseAgainstOperator from '../lib/compare-course-against-operator'

describe('compareCourseAgainstOperator', () => {
    it('compares a course property against an operator', () => {
        const course = {department: ['ART'], number: 310}
        expect(compareCourseAgainstOperator(course, 'number', {$eq: 310})).to.be.true
    })

    it('supports $eq', () => {
        const course = {department: ['ART'], number: 310}
        expect(compareCourseAgainstOperator(course, 'number', {$eq: 310})).to.be.true
    })

    it('supports $ne', () => {
        const course = {department: ['ART'], number: 310}
        expect(compareCourseAgainstOperator(course, 'number', {$ne: 210})).to.be.true
        expect(compareCourseAgainstOperator(course, 'number', {$ne: 310})).to.be.false
    })

    it('supports $lt', () => {
        const course = {department: ['ART'], number: 200}
        expect(compareCourseAgainstOperator(course, 'number', {$lt: 300})).to.be.true
        expect(compareCourseAgainstOperator(course, 'number', {$lt: 100})).to.be.false
    })

    it('supports $lte', () => {
        const course = {department: ['ART'], number: 310}
        expect(compareCourseAgainstOperator(course, 'number', {$lte: 310})).to.be.true
        expect(compareCourseAgainstOperator(course, 'number', {$lte: 200})).to.be.false
    })

    it('supports $gt', () => {
        const course = {department: ['ART'], number: 300}
        expect(compareCourseAgainstOperator(course, 'number', {$gt: 200})).to.be.true
        expect(compareCourseAgainstOperator(course, 'number', {$gt: 400})).to.be.false
    })

    it('supports $gte', () => {
        const course = {department: ['ART'], number: 310}
        expect(compareCourseAgainstOperator(course, 'number', {$gte: 310})).to.be.true
        expect(compareCourseAgainstOperator(course, 'number', {$gte: 400})).to.be.false
    })

    it('compares checks for items within arrays', () => {
        const course = {department: ['ART', 'ASIAN'], number: 310}
        expect(compareCourseAgainstOperator(course, 'department', {$eq: 'ART'})).to.be.true
        expect(compareCourseAgainstOperator(course, 'department', {$eq: 'ASIAN'})).to.be.true
    })

    it('$ne checks if an item does not exist within an array?', () => {
        const course = {department: ['ART', 'ASIAN'], number: 310}
        expect(compareCourseAgainstOperator(course, 'department', {$ne: 'CSCI'})).to.be.true
    })

    it('compares courses against a pre-determined query', () => {
        const course = {department: ['ART', 'ASIAN'], year: 2015}
        const operator = {$lte: {'$computed-value': 2016}}
        expect(compareCourseAgainstOperator(course, 'year', operator)).to.be.true
    })

    it('refuses to compare against an array', () => {
        const course = {department: ['ART', 'ASIAN'], year: 2015}
        const operator = {$lte: [2016]}
        expect(() => compareCourseAgainstOperator(course, 'year', operator)).to.throw(TypeError)
    })
})
