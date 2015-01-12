import _ from 'lodash'

import hasDepartment from 'sto-helpers/lib/hasDepartment'
import {partialNameOrTitle} from 'sto-helpers/lib/partialTitle'
import {coursesAboveNumber} from 'sto-helpers/lib/courseLevels'
import checkCoursesFor from 'sto-helpers/lib/checkCoursesFor'

import isAsianCon from 'sto-helpers/lib/isAsianCon'
import isRequiredCourse from 'sto-helpers/lib/isRequiredCourse'

const japanStudiesRequiredCourses = [
	{deptnum: 'ASIAN 275'}, {deptnum: 'ASIAN 397'}, {deptnum: 'ASIAN 399'},
]

let isRequiredJapanStudiesCourse = isRequiredCourse(japanStudiesRequiredCourses)

function lowerLevelLanguageCourses(course) {
	return _.all([
		hasDepartment(['CHINA', 'JAPAN'], course),
		(course.level < 300),
	])
}

function language(courses) {
	// Four Japanese language courses above Japanese 112;
	let japaneseLanguage = _(courses)
		.filter(hasDepartment('JAPAN'))
		.filter(coursesAboveNumber(112))
		.value()

	let numberNeeded = 4
	let numberFulfilled = _.size(japaneseLanguage)
	let hasEnoughJapanese = numberFulfilled >= numberNeeded

	return {
		title: 'Language',
		type: 'object/number',
		description: 'Two courses in Japanese or Japanese above 112 or its equivalent',
		result: numberFulfilled >= numberNeeded,
		details: {
			has: numberFulfilled,
			needs: numberNeeded,
			matches: japaneseLanguage,
		},
	}
}

function electives(courses) {
	// Two other courses on Japan;
	// no level I or II language courses may count in this category

	let asianCon = _.filter(courses, isAsianCon)

	let japanElectives = _(courses)
		// Only things in the Asian Studies or Japanese departments...
		.filter(hasDepartment(['ASIAN', 'JAPAN']))
		// that have the stems Japanese or China in their names...
		.filter(partialNameOrTitle(['Japanese', 'Japan']))
		// ignoring the language courses under 300 level...
		.reject(lowerLevelLanguageCourses)
		// and rejecting the required japanese studies courses,
		.reject(isRequiredJapanStudiesCourse)
		// then adding in AsianCon.
		.concat(asianCon)
		.value()

	let matching = _.size(japanElectives)
	let needs = 2

	return {
		title: 'Electives',
		type: 'object/number',
		description: 'Two other courses on China; no level I or II language courses may count in this category',
		result: matching >= needs,
		details: {
			has: matching,
			needs: needs,
			matches: japanElectives,
		},
	}
}

function checkJapanStudiesConcentration(student) {
	return student.data().then((studentPieces) => {
		let {courses} = studentPieces

		let japanStudiesConcentrationRequirements = [
			language(courses),
			electives(courses),
		]

		return {
			result: _.all(japanStudiesConcentrationRequirements, 'result'),
			details: japanStudiesConcentrationRequirements,
		}
	})
}

let japanStudiesConcentration = {
	title: 'Japan Studies',
	type: 'concentration',
	id: 'c-japan',
	departmentAbbr: 'JAPAN',
	years: [2014, null],

	check: checkJapanStudiesConcentration,
	_requirements: {
		language,
		electives,
	},
}

export default japanStudiesConcentration
