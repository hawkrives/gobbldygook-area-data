import sortBy from 'lodash/collection/sortBy'

/**
 * Simplifies a course to just the department/number combo.
 * @private
 * @param {Course} course - the course to simplify
 * @returns {string} - the stringified, simplified course
 */

export default function simplifyCourse(course) {
    return `${sortBy(course.department).join('/')} ${course.number}`
}

/*
export default (() => {
    // const cache = new WeakMap()
    return function simplifyCourse(course) {
        // because we can't expect the handy unique crsid to exist on courses from
        // area specs, we have to figure it out on our own.

        // the closest thing we can do is to reduce a course to the department +
        // number combination.

        // because we're overloading the term "course" even more than normal here.
        // in this case, it's a set of key:value props that are applied as a
        // filter to a list of fully-fledged course objects (which are actually
        // classes, but whatevs.)

        // so, if c1 looks like {dept: A, num: 1}, and c2 looks like {dept: A,
        // num: 1, year: 2015}, c2 is a more specific instance of c1.

        // TODO: test these two for speeeeeed
        // if (cache.has(course)) {
        //     return cache.get(course)
        // }
        // else {
        //     const str = `${sortBy(course.department).join('/')} ${course.number}`
        //     cache.set(course, str)
        //     return str
        // }
        return `${sortBy(course.department).join('/')} ${course.number}`
    }
})()
*/
