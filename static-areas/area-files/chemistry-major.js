import {checkListForCourse, special, oneOf} from './helpers'

function intro(student) {
	const c = checkListForCourse(student.courses)

	const firstYear = (c('CHEM 121') && c('CHEM 123') && c('CHEM 126'))
	const firstYearHS = (c('CHEM 125') && c('CHEM 126'))
	const chBiOld = (c('CH/BI 125') && c('CH/BI 126') && c('CH/BI 127'))
	const chBi = (c('CH/BI 125') && c('CH/BI 126') && c('CH/BI 227'))

	const intro = {
		name: 'Intro',
		result: firstYear || firstYearHS || chBiOld || chBi,
		type: 'one-of',
		details: [
			{
				name: 'First Year',
				description: 'All of CHEM 121, CHEM 123, and CHEM 125',
				result: firstYear,
			},
			{
				name: 'First Year (HS)',
				description: 'Both CHEM 125 and CHEM 126',
				result: firstYearHS,
			},
			{
				name: 'CH/BI (Old)',
				description: 'All of CH/BI 125, CH/BI 126, and CH/BI 127',
				result: chBiOld,
			},
			{
				name: 'CH/BI',
				description: 'All of CH/BI 125, CH/BI 126, and CH/BI 227',
				result: chBi,
			}
		]
	}

	return intro
}

function organic(student) {
	const c = checkListForCourse(student.courses)

	const organic = {
		name: 'Organic',
		description: 'All of CHEM 247, CHEM 253, CHEM 248, and CHEM 254',
		result: (c('CHEM 247') && c('CHEM 253') && c('CHEM 248') && c('CHEM 254'))
	}

	return organic
}

function analytical(student) {
	const c = checkListForCourse(student.courses)

	const analytical = {
		name: 'Analytical',
		description: 'Both of CHEM 255, and CHEM 256',
		result: (c('CHEM 255') && c('CHEM 256'))
	}

	return analytical
}

function physical(student) {
	const c = checkListForCourse(student.courses)

	const physical = {
		name: 'Physical',
		description: 'Both of CHEM 357 and CHEM 371',
		result: (c('CHEM 357') && c('CHEM 371'))
	}

	return physical
}

function elective(student) {
	const c = checkListForCourse(student.courses)

	const elective = {
		name: 'Elective',
		description: 'One of CHEM 252, CHEM 260, CHEM 298, CHEM 379, both CHEM 382 and CHEM 378, CHEM 384, CHEM 386, CHEM 388, CHEM 391, or CHEM 398',
		result: mustBeTrue(1, [
			c('CHEM 252'),
			c('CHEM 260'),
			c('CHEM 298'),
			c('CHEM 379'),
			(c('CHEM 382') && c('CHEM 378')),
			c('CHEM 384'),
			c('CHEM 386'),
			c('CHEM 388'),
			c('CHEM 391'),
			c('CHEM 398'),
		])
	}

	return elective
}

function physics(student) {
	const c = checkListForCourse(student.courses)

	const nonMajors = (c('PHYS 124') && c('PHYS 125'))
	const majors = (c('PHYS 131') && c('PHYS 132'))

	const physics = {
		name: 'Physics',
		description: 'Either Majors or Non-Majors',
		type: 'one-of',
		result: majors || nonMajors,
		details: [
			{
				name: 'Non-Majors',
				description: 'Both PHYS 124 and PHYS 125',
				result: nonMajors
			},
			{
				name: 'Majors',
				description: 'Both PHYS 131 and PHYS 132',
				result: majors
			}
		]
	}

	return physics
}

function calculus(student) {
	const c = checkListForCourse(student.courses)
	const calculus = {
		name: 'Calculus',
		description: 'Either MATH 126 or MATH 128',
		result: (c('MATH 126') || c('MATH 128')),
	}
	return calculus
}

function seminars(student) {
	const c = checkListForCourse(student.courses)
	const seminars = {
		name: 'Seminars',
		description: 'Attendance of at least 12 departmental seminars',
		result: true,
	}
	return seminars
}

export default function checkChemistryMajor(student) {
	let results = [intro, organic, analytical, physical, elective, physics, calculus, special]

	return {
		result: all(results, 'result'),
		details: results,
	}
}
