// import {checkCoursesFor, checkOverridesFor} from 'app/lib'
import map from 'lodash/collection/map'
import size from 'lodash/collection/size'
import partial from 'lodash/function/partial'
import find from 'lodash/collection/find'
import get from 'lodash/object/get'

function checkOverridesFor(overrides, ...path) {
	return get(overrides, path)
}

function checkCoursesFor(courses, courseInfo) {
	return find(courses, courseInfo)
}

function Foundation({courses, overrides}) {
	const o = partial(checkOverridesFor, overrides)
	const c = partial(checkCoursesFor, courses)

	function Intro() {
		const override = o('majors', 'Computer Science', 'Foundation', 'Intro')
		const matches = [c({dept: 'CSCI', num: 121}), c({dept: 'CSCI', num: 125})]

		let result = false
		if (!override) {
			const results = map(matches, (m) => Boolean(size(m)))
			result = results[0] || results[1]
		}

		return {
			title: 'Intro',
			description: 'Either CS 121 (Introduction to Computer Science) or CS 125 (Computer Science for Scientists)',
			result: override || result,
			overridden: override,
			matches: matches,
		}
	}

	function Design() {
		const override = o('majors', 'Computer Science', 'Foundation', 'Design')
		const matches = [c({dept: 'CSCI', num: 241}), c({dept: 'CSCI', num: 251}), c({dept: 'CSCI', num: 252})]

		let result = false
		if (!override) {
			const results = map(matches, (m) => Boolean(size(m)))
			result = results[0] && results[1] && results[2]
		}

		return {
			title: 'Design',
			description: 'All of CS 241 (Hardware Design), CS 251 (Software Design), and CS 252 (Software Design Lab)',
			result: override || result,
			overridden: override,
			matches: matches,
		}
	}

	function ProofWriting() {
		const override = o('majors', 'Computer Science', 'Foundation', 'Proof-Writing')
		const matches = [c({dept: 'MATH', num: 282, year: 2014, semester: 1}), c({dept: 'MATH', num: 244}), c({dept: 'MATH', num: 252})]

		let result = false
		if (!override) {
			const results = map(matches, (m) => Boolean(size(m)))
			result = results[0] || results[1] || results[2]
		}

		return {
			title: 'Proof-Writing',
			description: 'One of Math 282 in Spring 2014-15 (Introduction to Abstract Math), Math 244 (One Option), or Math 252 (The Other Thing)',
			result: override || result,
			overridden: override,
			matches: matches,
		}
	}

	const IntroResult = Intro()
	const DesignResult = Design()
	const ProofWritingResult = ProofWriting()

	const result = IntroResult.result && DesignResult.result && ProofWritingResult.result
	const override = o('majors', 'Computer Science', 'Foundation')

	return {
		title: 'Foundation',
		description: 'All of Intro, Design, and Proof-Writing',
		result: override || result,
		overridden: override,
		requirements: [
			Intro,
			Design,
			ProofWriting,
		]
	}
}

function Core({courses, overrides}) {
	const o = partial(checkOverridesFor, overrides)
	const c = partial(checkCoursesFor, courses)

	function Algorithms() {
		const override = o('majors', 'Computer Science', 'Core', 'Algorithms')
		const matches = [c({dept: 'CSCI', num: 253})]

		let result = false
		if (!override) {
			const results = map(matches, (m) => Boolean(size(m)))
			result = results[0]
		}

		return {
			title: 'Algorithms',
			description: 'CS 253 (Algorithms and Data Structures)',
			result: override || result,
			overridden: override,
			matches: matches,
		}
	}

	function Ethics() {
		const override = o('majors', 'Computer Science', 'Core', 'Ethics')
		const matches = [c({dept: 'CSCI', num: 263})]

		let result = false
		if (!override) {
			const results = map(matches, (m) => Boolean(size(m)))
			result = results[0]
		}

		return {
			title: 'Ethics',
			description: 'CS 263 (Ethics of Software Design)',
			result: override || result,
			overridden: override,
			matches: matches,
		}
	}

	function Theory() {
		const override = o('majors', 'Computer Science', 'Core', 'Theory')
		const matches = [c({dept: 'CSCI', num: 276}), c({dept: 'CSCI', num: 333})]

		let result = false
		if (!override) {
			const results = map(matches, (m) => Boolean(size(m)))
			result = results[0] || results[1]
		}

		return {
			title: 'Theory',
			description: 'Either CS 276 (...) or CS 333 (...)',
			result: override || result,
			overridden: override,
			matches: matches,
		}
	}

	function Systems() {
		const override = o('majors', 'Computer Science', 'Core', 'Systems')
		const matches = [c({dept: 'CSCI', num: 273}), c({dept: 'CSCI', num: 284}), c({dept: 'CSCI', num: 300, year: 2014, semester: 2}), c({dept: 'CSCI', num: 300, year: 2012, semester: 3})]

		let result = false
		if (!override) {
			const results = map(matches, (m) => Boolean(size(m)))
			result = results[0] || results[1] || results[2] || results[3]
		}

		return {
			title: 'Systems',
			description: 'Any of CS 273 (...), CS 284 (...), CS 300 in Iterim 2014-15 (...), or CS 300 in Spring 2012-13 (...)',
			result: override || result,
			overridden: override,
			matches: matches,
		}
	}

	const AlgorithmsResult = Algorithms()
	const EthicsResult = Ethics()
	const TheoryResult = Theory()
	const SystemsResult = Systems()

	const result = AlgorithmsResult.result && EthicsResult.result && TheoryResult.result && SystemsResult.result
	const override = o('majors', 'Computer Science', 'Core')

	return {
		title: 'Core',
		description: 'All of Algorithms, Ethics, Theory, and Systems',
		result: override || result,
		overridden: override,
		requirements: [
			Algorithms,
			Ethics,
			Theory,
			Systems,
		]
	}
}

function Electives({courses, overrides}) {
	const o = partial(checkOverridesFor, overrides)
	const c = partial(checkCoursesFor, courses)

	const override = o('majors', 'Computer Science', 'Electives')
	const matches = [c({dept: 'CSCI', num: 300, year: 2014, semester: 1}), c({dept: 'CSCI', num: 315}), c({dept: 'CSCI', num: 336}), c({dept: 'CSCI', num: 350})]

	let result = false
	if (!override) {
		const results = map(matches, (m) => Boolean(size(m)))
		result = size(results) >= 2
	}

	return {
		title: 'Electives',
		description: 'One of <these courses>',
		result: override || result,
		overridden: override,
		matches: matches,
	}
}

function Capstone({courses, overrides}) {
	const o = partial(checkOverridesFor, overrides)
	const c = partial(checkCoursesFor, courses)

	const override = o('majors', 'Computer Science', 'Capstone')
	const matches = [c({dept: 'CSCI', num: 390})]

	let result = false
	if (!override) {
		const results = map(matches, (m) => Boolean(size(m)))
		result = results[0]
	}

	return {
		title: 'Capstone',
		description: 'CSCI 390 (Capstone)',
		result: override || result,
		overridden: override,
		matches: matches,
	}
}

function _check(studentData) {
	return studentData.then((data) => {
		const {courses, overrides} = data
		const o = partial(checkOverridesFor, overrides)

		const FoundationResult = Foundation({courses, overrides})
		const CoreResult = Core({courses, overrides})
		const ElectivesResult = Electives({courses, overrides})
		const CapstoneResult = Capstone({courses, overrides})

		const result = FoundationResult.result && CoreResult.result && ElectivesResult.result && CapstoneResult.result

		const override = o('majors', 'Computer Science')
		return {
			result: override || result,
			overridden: override,
			sets: [
				FoundationResult,
				CoreResult,
				ElectivesResult,
				CapstoneResult,
			]
		}
	})
}

export default {
	title: 'Computer Science',
	revision: '2014-15',
	type: 'major',
	check: _check,
}
