import {checkCoursesFor, checkOverridesFor} from 'app/lib'
import partial from 'lodash/function/partial'

function Core({courses, overrides}) {
	const o = partial(checkOverridesFor, overrides)
	const c = partial(checkCoursesFor, courses)

	function Intro() {
		const result = c('CSCI 121') || c('CSCI 125')
		const override = o('majors', 'Computer Science', 'Core', 'Intro')
		return {
			title: 'Intro',
			description: 'Either CS 121 (Introduction to Computer Science) or CS 125 (Computer Science for Scientists)',
			result: override || result,
			overridden: override,
		}
	}
	function Design() {
		const result = c('CSCI 241') && c('CSCI 251') && c('CSCI 252')
		const override = o('majors', 'Computer Science', 'Core', 'Design')
		return {
			title: 'Design',
			description: 'All of CS 241 (Hardware Design), CS 251 (Software Design), and CS 252 (Software Design Lab)',
			result: override || result,
			overridden: override,
		}
	}
	function ProofWriting() {
		const result = c('MATH 282.*.2014.1') || c('MATH 244') || c('MATH 252')
		const override = o('majors', 'Computer Science', 'Core', 'Proof-Writing')
		return {
			title: 'Proof-Writing',
			description: 'One of Math 282 (Topics) from Spring 2014-15, Math 244 (One Option), or Math 252 (The Other Thing)',
			result: override || result,
			overridden: override,
		}
	}

	const IntroResult = Intro()
	const DesignResult = Design()
	const ProofWritingResult = ProofWriting()

	const result = Intro && Design && ProofWriting
	const override = o('majors', 'Computer Science', 'Core')

	return {
		title: 'Core',
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

function _check(studentData) {
	return studentData.then((data) => {
		const {courses, overrides} = data
		const o = partial(checkOverridesFor, overrides)

		const CoreResult = Core(courses)
		const result = CoreResult
		const override = o('majors', 'Computer Science')
		return {
			result: override || result,
			overridden: override,
			sets: [
				CoreResult,
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
