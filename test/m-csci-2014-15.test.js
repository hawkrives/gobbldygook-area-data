// test/m-csci-2014-15.test.js
import findArea from '../index'
let compSci = findArea('m-csci', 2014)
let reqs = compSci._requirements

describe('Computer Science Major [2014-15]', () => {
	describe('#foundationCourses()', () => {
		let {foundationCourses} = compSci._requirements

		it('checks for courses that fulfill the foundational requirements', () => {
			let validCourseSet = [
				{deptnum: 'CSCI 121'},
				{deptnum: 'CSCI 251'},
				{deptnum: 'CSCI 252'},
				{deptnum: 'CSCI 241'},
				{deptnum: 'MATH 282', term: 20141},
			]

			let result = foundationCourses(validCourseSet)

			expect(result).property('title').to.equal('Foundation')
			expect(result).property('type').to.equal('array/boolean')
			expect(result).property('result').to.be.true
			expect(result).property('details').to.be.an.array
			expect(result).deep.property('details[0].result').to.be.true
			expect(result).deep.property('details[1].result').to.be.true
			expect(result).deep.property('details[2].result').to.be.true
		})

		it('not all sets of courses are valid', () => {
			let invalidCourseSet = [{deptnum: 'CSCI 121'}]
			let result = foundationCourses(invalidCourseSet)
			expect(result).property('result').to.be.false
		})
	})

	describe('#coreCourses()', () => {
		let {coreCourses} = compSci._requirements

		it('checks for courses that fulfill the core requirements', () => {
			let validCourseSet = [
				{deptnum: 'CSCI 253'},
				{deptnum: 'CSCI 263'},
				{deptnum: 'CSCI 276'},
				{deptnum: 'CSCI 300', title: 'Parallel and Distributed Computing'},
			]

			let result = coreCourses(validCourseSet)

			expect(result).property('title').to.equal('Core')
			expect(result).property('type').to.equal('array/boolean')
			expect(result).property('result').to.be.true
			expect(result).property('details').to.be.an.array
			expect(result).deep.property('details[0].result').to.be.true
			expect(result).deep.property('details[1].result').to.be.true
			expect(result).deep.property('details[2].result').to.be.true
			expect(result).deep.property('details[3].result').to.be.true
		})

		it('not all sets of courses are valid', () => {
			let invalidCourseSet = [{deptnum: 'CSCI 253'}]
			let result = coreCourses(invalidCourseSet)
			expect(result).property('result').to.be.false
		})
	})

	describe('#electiveCourses()', () => {
		let {electiveCourses} = compSci._requirements

		it('checks for courses that fulfill the electives requirement', () => {
			let validCourseSet = [
				{depts: ['CSCI'], deptnum: 'CSCI 200'},
				{depts: ['CSCI'], deptnum: 'CSCI 201'},
				{depts: ['CSCI'], deptnum: 'CSCI 300'},
			]

			let result = electiveCourses(validCourseSet)

			expect(result).property('title').to.equal('Electives')
			expect(result).property('type').to.equal('object/number')
			expect(result).property('result').to.be.true
			expect(result).property('details').to.be.an.object
			expect(result).deep.property('details.has').to.equal(3)
			expect(result).deep.property('details.needs').to.equal(2)
			expect(result).deep.property('details.matches').to.be.an.array
			expect(result).deep.property('details.matches').to.have.length(3)
		})

		it('not all sets of courses are valid', () => {
			let invalidCourseSet = [{depts: ['CSCI'], deptnum: 'CSCI 200'}]
			let result = electiveCourses(invalidCourseSet)
			expect(result).property('result').to.be.false
		})
	})

	describe('#capstoneCourse()', () => {
		let {capstoneCourse} = compSci._requirements

		it('checks for courses that fulfill the capstone requirement', () => {
			let validCourseSet = [
				{depts: ['CSCI'], deptnum: 'CSCI 390'},
			]

			let result = capstoneCourse(validCourseSet)

			expect(result).property('title').to.equal('Capstone')
			expect(result).property('type').to.equal('boolean')
			expect(result).property('result').to.be.true
		})

		it('not all sets of courses are valid', () => {
			let invalidCourseSet = [{depts: ['CSCI'], deptnum: 'CSCI 200'}]
			let result = capstoneCourse(invalidCourseSet)
			expect(result).property('result').to.be.false
		})
	})

	describe('#checkComputerScienceMajor()', () => {
		it('returns a promise', () => {
			expect(compSci.check(global.basicThenableStudent)).to.be.a.Promise
		})
	})
})
