import curry from 'lodash.curry'
import every from 'lodash.every'

let checkListForCourse = curry((courses, course) =>
	courses.filter(c => c.deptnum === course).length > 0)

function oneOf(list) {
	for (let check of list)
		if (check)
			return true
	return false
}

function specialFunc(str) {
	return true
}

function check(courses) {
	let c = checkListForCourse(courses)
	let intro = (
		c("CHEM 121") && c("CHEM 123") && c("CHEM 126")
		||
		c("CHEM 125") && c("CHEM 126")
		||
		c("CH/BI 125") && c("CH/BI 126") && c("CH/BI 127")
		||
		c("CH/BI 125") && c("CH/BI 126") && c("CH/BI 227")
	)

	let organic = (c("CHEM 247") && c("CHEM 253") && c("CHEM 248") && c("CHEM 254"))

	let analytical = (c("CHEM 255") && c("CHEM 256"))

	let physical = (c("CHEM 357") && c("CHEM 371"))

	let elective = oneOf([
		c("CHEM 252"),
		c("CHEM 260"),
		c("CHEM 298"),
		c("CHEM 379"),
		(c("CHEM 382") && c("CHEM 378")),
		c("CHEM 384"),
		c("CHEM 386"),
		c("CHEM 388"),
		c("CHEM 391"),
		c("CHEM 398"),
	])

	let physics = (
		c("PHYS 124") && c("PHYS 125")
		||
		c("PHYS 131") && c("PHYS 132")
	)

	let calculus = (c("MATH 126") || c("MATH 128"))

	let special = specialFunc("Attendance of at least 12 departmental seminars")

	let results = [
		{
			name: 'Intro',
			result: intro,
		},
		{
			name: 'Organic',
			result: organic,
		},
		{
			name: 'Analytical',
			result: analytical,
		},
		{
			name: 'Physical',
			result: physical,
		},
		{
			name: 'Elective',
			result: elective,
		},
		{
			name: 'Physics',
			result: physics,
		},
		{
			name: 'Calculus',
			result: calculus,
		},
		{
			name: 'Special',
			result: special,
		},
	]

	return {
		result: every(results, 'result'),
		details: results,
	}
}

export default check
