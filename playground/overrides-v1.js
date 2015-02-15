function electives_v1(courses, overrides) {
	////// begin calculating
	function findContributingElements(courses, overrides) {
		// Six electives, with stipulations:
		// 1. At least two at level II or level III, taken on campus;
		// 2. No more than two at level I;
		// 3. No more than four elective courses about any one country;
		// 4. No level I or level II language courses may count.

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

		return {
			asianStudiesElectives,
			levelsTwoOrThree,
			onlyTwoAtLevelOne,
			notTooSpecialized,
			electivesAreGood,
			needs,
		}
	}
	////// finish calculating

	////// begin finalizing
	function calculateRequirementSet(elements) {
		let {asianStudiesElectives, electivesAreGood, needs} = elements

		let matching = _.size(asianStudiesElectives)

		return {
			title: 'Electives',
			type: 'object/number',
			description: 'Six electives, with stipulations: 1. At least two at level II or level III, taken on campus; 2. No more than two at level I; 3. No more than four elective courses about any one country; 4. No level I or level II language courses may count.',
			result: (matching >= needs) && electivesAreGood,
			details: {
				has: matching,
				needs: needs,
				matches: asianStudiesElectives,
			},
		}
	}
	////// finish finalizing

	function findAndCalculateThingsWrapper(object, applicableOverrides) {
		return _.merge(object, applicableOverrides, concatAndMerge)
	}

	////// apply overrides
	let elementOverrides = findApplicableOverrides(title, 'elements', overrides)
	let resultOverrides  = findApplicableOverrides(title, 'results', overrides)

	let elements = findAndCalculateThingsWrapper(findContributingElements(courses, elementOverrides))
	let results = findAndCalculateThingsWrapper(calculateRequirementSet(elements, resultOverrides))
	////// return final result

	return results
}
