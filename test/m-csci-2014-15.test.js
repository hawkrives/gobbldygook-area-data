// test/m-csci-2014-15.test.js
import findArea from '../index'
let compSci = findArea('m-csci', 2014)
let reqs = compSci._requirements

describe('Major - Computer Science (2014-15)', () => {
	it('foundationCourses - checks for courses that fulfill the foundational requirements', () => {
		let {foundationCourses} = compSci._requirements
		let validCourseSet = [
			{deptnum: 'CSCI 121'},
			{deptnum: 'CSCI 251'},
			{deptnum: 'CSCI 252'},
			{deptnum: 'CSCI 241'},
			{deptnum: 'MATH 282', term: 20141},
		]

		let expectedResult = {
			title: 'Foundation',
			type: 'array/boolean',
			description: /\w/,
			result: true,
			details: [
				{ title: 'CS1', result: true, },
				{ title: 'Design', result: true, },
				{ title: 'Proof Writing', result: true, },
			],
		}

		foundationCourses(validCourseSet).should.match(expectedResult)
	})

	it('coreCourses - checks for courses that fulfill the core requirements', () => {
		let {coreCourses} = compSci._requirements
		let validCourseSet = [
			{deptnum: 'CSCI 253'},
			{deptnum: 'CSCI 263'},
			{deptnum: 'CSCI 276'},
			{deptnum: 'CSCI 300', title: 'Parallel and Distributed Computing'},
		]

		let expectedResult = {
			title: 'Core',
			type: 'array/boolean',
			description: /\w/,
			result: true,
			details: [
				{ title: 'Algorithms', result: true, description: /\w/, },
				{ title: 'Ethics', result: true, description: /\w/, },
				{ title: 'Theory', result: true, description: /\w/, },
				{ title: 'Options', result: true, description: /\w/, },
			],
		}

		coreCourses(validCourseSet).should.match(expectedResult)
	})

	it('electiveCourses - checks for courses that fulfill the electives requirement', () => {
		let {electiveCourses} = compSci._requirements
		let validCourseSet = [
			{depts: ['CSCI'], deptnum: 'CSCI 200'},
			{depts: ['CSCI'], deptnum: 'CSCI 201'},
			{depts: ['CSCI'], deptnum: 'CSCI 300'},
		]

		let expectedResult = {
			title: 'Electives',
			type: 'object/number',
			description: /\w/,
			result: true,
			details: {
				has: 3,
				needs: 2,
				matches: validCourseSet,
			},
		}

		electiveCourses(validCourseSet).should.match(expectedResult)
	})

	it('capstoneCourse - checks for courses that fulfill the capstone requirement', () => {
		let {capstoneCourse} = compSci._requirements
		let validCourseSet = [
			{depts: ['CSCI'], deptnum: 'CSCI 390'},
		]

		let expectedResult = {
			title: 'Capstone',
			type: 'boolean',
			description: /\w/,
			result: true,
		}

		capstoneCourse(validCourseSet).should.match(expectedResult)
	})

	it('checkComputerScienceMajor - expects a promise', () => {
		compSci.check({then() { return {courses: []} }}).should.be.a.Promise
	})
})
