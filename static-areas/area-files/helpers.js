export let checkCoursesFor = curry((courseList=[], number=0, prop='', value='', {filteredCourses=[]}={}) => {
	const courses = filteredCourses.length ? filteredCourses : courseList
	const results = filter(courses, (course) => {
		if (isArray(course[prop]))
			return includes(course[prop], value)
		return course[prop] === value
	})

	return {result: size(results) >= number, matches: results}
})

export function countCourses(...courseArrays) {
	const courses = union(courseArrays)
	return size(courses)
}

export function countDepartments(...courseArrays) {
	const courses = union(courseArrays)
	//
}

