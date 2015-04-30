import curry from 'lodash.curry'

let checkListForCourse = curry((courses, course) =>
	courses.filter(c => c.deptnum === course).length > 0)

function oneOf(list) {
	for (let check of list)
		if (check)
			return true
	return false
}

function special(str) {
	return true
}

function check(courses) {
	let c = checkListForCourse(courses)
	return (
		(
			c("CHEM 121") && c("CHEM 123") && c("CHEM 125")
			||
			c("CHEM 125") && c("CHEM 126")
			||
			c("CH/BI 125") && c("CH/BI 126") && c("CH/BI 127")
			||
			c("CH/BI 125") && c("CH/BI 126") && c("CH/BI 227")
		)
		&&
		(c("CHEM 247") && c("CHEM 253") && c("CHEM 248") && c("CHEM 254"))
		&&
		(c("CHEM 255") && c("CHEM 256"))
		&&
		(c("CHEM 357") && c("CHEM 371"))
		&&
		oneOf([
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
		&&
		(
			c("PHYS 124") && c("PHYS 125")
			||
			c("PHYS 131") && c("PHYS 132")
		)
		&&
		(c("MATH 126") || c("MATH 128"))
		&&
		special("Attendance of at least 12 departmental seminars")
	)
}

export default check
