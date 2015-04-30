import {min, filter, reject, isArray, union, includes} from 'lodash'
import {
	checkCoursesFor,
	countCourses,
	countDepartments
} from './helpers'


function foundation(student) {
	const c = checkCoursesFor(student.courses)

	const {result: firstYearWriting} = c(1, 'gereq', 'FYW')
	const {result: writingInContext} = c(4, 'gereq', 'WRI')
	const foreignLanguage = (() => {
		const {result: french} = c(1, 'gereq', 'FOL-F')
		const {result: german} = c(1, 'gereq', 'FOL-G')
		const {result: spanish} = c(1, 'gereq', 'FOL-S')
		const {result: chinese} = c(1, 'gereq', 'FOL-C')
		const {result: greek} = c(1, 'gereq', 'FOL-K')
		const {result: latin} = c(1, 'gereq', 'FOL-L')
		const {result: japanese} = c(1, 'gereq', 'FOL-J')
		const {result: norwegian} = c(1, 'gereq', 'FOL-N')
		const {result: russian} = c(1, 'gereq', 'FOL-R')
		const result = french || german || spanish || chinese || greek || latin || japanese || norwegian || russian
		return result
	})()
	const {result: oralCommunication} = c(1, 'gereq', 'ORC')
	const {result: abstractAndQuantitativeReasoning} = c(1, 'gereq', 'AQR')
	const {result: studiesInPhysicalMovement} = c(2, 'gereq', 'SPM')

	const result = {
		name: 'Foundation',
		result: firstYearWriting && writingInContext && foreignLanguage && oralCommunication && abstractAndQuantitativeReasoning && studiesInPhysicalMovement,
		type: 'list',
		details: [
			{
				name: 'First-Year Writing',
				abbr: 'FYW',
				result: firstYearWriting,
			}
			{
				name: 'Writing in Context',
				abbr: 'WRI',
				result: writingInContext,
			}
			{
				name: 'Foreign Language',
				abbr: 'FOL',
				result: foreignLanguage,
			}
			{
				name: 'Oral Communication',
				abbr: 'ORC',
				result: oralCommunication,
			}
			{
				name: 'Abstract and Quantitative Reasoning',
				abbr: 'AQR',
				result: abstractAndQuantitativeReasoning,
			}
			{
				name: 'Studies in Physical Movement',
				abbr: 'SPM',
				result: studiesInPhysicalMovement,
			}
		],
	}
	return result
}

function core(student) {
	const c = checkCoursesFor(student.courses)

	const {result: historicalStudiesInWesternCulture} = c(2, 'gereq', 'HWC')

	const multiCulturalStudies = (() => {
		const {result: domestic, matches: domesticCourses} = c(1, 'gereq', 'MCD')
		const {result: global, matches: globalCourses} = c(1, 'gereq', 'MCG')
		const result = countCourses(domesticCourses, globalCourses) >= 2 && countDepartments(domesticCourses, globalCourses) >= 2 && domestic && global
		return {
			result,
			details: [
				{
					name: 'Domestic',
					abbr: 'MCD',
					result: domestic,
				},
				{
					name: 'Global',
					abbr: 'MCG',
					result: global,
				},
			]
		}
	})()

	const artisticAndListeraryStudies = (() => {
		const {result: art, matches: artCourses} = c(1, 'gereq', 'ALS-A')
		const {result: literature, matches: literatureCourses} = c(1, 'gereq', 'ALS-L')
		const result = countCourses(artCourses, literatureCourses) >= 2 && art && literature
		return {
			result,
			details: [
				{
					name: 'Art',
					abbr: 'ALS-A',
					result: art,
				},
				{
					name: 'Literature',
					abbr: 'ALS-L',
					result: literature,
				},
			]
		}
	})()

	const biblicalAndTheologicalStudies = (() => {
		const biblical = (() => {
			const filteredCourses = filter(student.courses, (course) => {
				return course.year === student.matriculation
			})
			const {result} = c(1, 'gereq', 'BTS-B', {filteredCourses})
			return result
		})
		const {result: theological} = c(1, 'gereq', 'BTS-T')
		const result = biblical && theological
		return {
			result,
			details: [
				{
					name: 'Biblical',
					abbr: 'BTS-B',
					result: biblical,
				},
				{
					name: 'Theological',
					abbr: 'BTS-T',
					result: theological,
				},
			]
		}
	})()

	const studiesInNaturalScience = (() => {
		const {result: scientificExplorationAndDiscovery, matches: scientificExplorationAndDiscoveryCourses} = c(1, 'gereq', 'SED')
		const {result: integratedScientificTopics, matches: integratedScientificTopicsCourses} = c(1, 'gereq', 'IST')
		const result = countCourses(scientificExplorationAndDiscoveryCourses, integratedScientificTopicsCourses) >= 2 && countDepartments(scientificExplorationAndDiscoveryCourses, integratedScientificTopicsCourses) >= 2 && scientificExplorationAndDiscovery && integratedScientificTopics
		return {
			result,
			details: [
				{
					name: 'Scientific Exploration and Discovery',
					result: scientificExplorationAndDiscovery,
				},
				{
					name: 'Integrated Scientific Topics',
					result: integratedScientificTopics,
				},
			]
		}
	})()

	const studiesInHumanBehaviorAndSociety = (() => {
		const {result: studiesInHumanBehaviorAndSociety, matches: studiesInHumanBehaviorAndSocietyCourses} = c(2, 'gereq', 'HBS', {includeCourses: true})
		const result = countDepartments(studiesInHumanBehaviorAndSocietyCourses) >= 2 && studiesInHumanBehaviorAndSociety
		return result
	})()

	const result = {
		name: 'Core',
		result: historicalStudiesInWesternCulture && multiCulturalStudies.result && artisticAndListeraryStudies.result && biblicalAndTheologicalStudies.result && studiesInNaturalScience.result && studiesInHumanBehaviorAndSociety,
		type: 'list',
		details: [
			{
				name: 'Historical Studies in Western Culture',
				abbr: 'HWC',
				result: historicalStudiesInWesternCulture,
			}
			{
				name: 'Multicultural Studies',
				type: 'set',
				result: multiCulturalStudies.result,
				details: multiCulturalStudies.details,
			}
			{
				name: 'Artistic and Literary Studies',
				type: 'set',
				result: artisticAndListeraryStudies.result,
				details: artisticAndListeraryStudies.details,
			}
			{
				name: 'Biblical and Theological Studies',
				type: 'set',
				result: biblicalAndTheologicalStudies.result,
				details: biblicalAndTheologicalStudies.details,
			}
			{
				name: 'Studies in Natural Science',
				type: 'set',
				result: studiesInNaturalScience.result,
				details: studiesInNaturalScience.details,
			}
			{
				name: 'Studies in Human Behavior and Society',
				abbr: 'HBS',
				result: studiesInHumanBehaviorAndSociety,
			}
		],
	}

	return result
}

function integrative(student) {
	const ethicalIssuesAndNormativePerspectives = (() => {
		const theologicalCourses = filter(student.courses, (course) =>
			includes(course.gereqs, 'BTS-T'))
		const tyear = min(theologicalCourses, (course) => course.year)
		const filteredCourses = filter(student.courses, (course) =>
			course.year >= tyear && course.year <= student.graduation)
		const {result} = c(1, 'gereq', 'EIN', {filteredCourses})
		return result
	})()

	return {
		name: 'Integrative',
		result: ethicalIssuesAndNormativePerspectives,
		type: 'list',
		details: [
			{
				name: 'Ethical Issues and Normative Perspectives',
				abbr: 'EIN',
				result: ethicalIssuesAndNormativePerspectives,
			}
		]
	}
}

function check(student) {
	return studentData.then((student) => {
		const result = foundation(student) && core(student) && integrative(student)
		return result
	})
}

export default {
	title: 'Bachelor of Arts',
	type: 'degree',
	revision: 2014,
	check: check
}
