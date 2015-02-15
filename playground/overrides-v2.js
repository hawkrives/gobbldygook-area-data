function findAndCalculateThingsWrapper(object, applicableOverrides) {
	return _.merge(object, applicableOverrides, concatAndMerge)
}

function electives_v2(courses, overrides) {
	// Six electives, with stipulations:
	// 1. At least two at level II or level III, taken on campus;
	// 2. No more than two at level I;
	// 3. No more than four elective courses about any one country;
	// 4. No level I or level II language courses may count.

	////// begin calculating

	let asianStudiesElectives = _(courses)
		.filter(hasDepartment('ASIAN'))
		.reject(lowerLevelLanguageCourses)
		.reject(isRequiredAsianStudiesCourse)
		.value()

	let levelsTwoOrThree = _(asianStudiesElectives)
		.filter(coursesAtOrAboveLevel(200))
		.size() >= 2

	let onlyTwoAtLevelOne = _(asianStudiesElectives)
		.filter(coursesAtLevel(100))
		.size() <= 2

	let notTooSpecialized = _.any([
		_(asianStudiesElectives).filter(partialNameOrTitle('China')).size() <= 4,
		_(asianStudiesElectives).filter(partialNameOrTitle('Japan')).size() <= 4,
	])

	// Req. #4 was embedded at the beginning, when we reject any lower-level
	// languages. That way, we can't count them.
	let electivesAreGood = _.all([levelsTwoOrThree, onlyTwoAtLevelOne, notTooSpecialized])

	let needs = 6

	let elementParts = {
		asianStudiesElectives,
		levelsTwoOrThree,
		onlyTwoAtLevelOne,
		notTooSpecialized,
		electivesAreGood,
		needs,
	}

	////// finish calculating
	////// apply overrides

	let elementOverrides = getApplicableOverrides(overrides, title, 'elements')

	let elements = findAndCalculateThings(elementParts, elementOverrides)

	////// begin finalizing

	let matching = _.size(elements.asianStudiesElectives)

	let resultParts = {
		title: 'Electives',
		type: 'object/number',
		description: 'Six electives, with stipulations: 1. At least two at level II or level III, taken on campus; 2. No more than two at level I; 3. No more than four elective courses about any one country; 4. No level I or level II language courses may count.',
		result: (matching >= elements.needs) && elements.electivesAreGood,
		details: {
			has: matching,
			needs: elements.needs,
			matches: elements.asianStudiesElectives,
		},
	}

	////// finish finalizing
	////// apply overrides
	let resultOverrides = getApplicableOverrides(overrides, title, 'results')

	let results = findAndCalculateThings(resultParts, resultOverrides)
	////// return final result

	return results
}
