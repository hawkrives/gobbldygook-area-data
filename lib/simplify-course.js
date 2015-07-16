import sortBy from 'lodash/collection/sortBy'

export default function simplifyCourse(course) {
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

    return `${sortBy(course.department).join('/')} ${course.number}`
}
