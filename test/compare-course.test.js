import tape from 'tape'

import {compareCourse} from '../lib/compare-course'

tape('compareCourse', (t) => {
    t.true(
        compareCourse({department: ['ART'], number: 310}, {department: ['ART'], number: 310}),
        'compares select keys of courses')

    t.true(compareCourse({}, {}), 'compares empty objects to be equal')

    t.test('compares the "department" prop', (st) => {
        st.true(
            compareCourse({department: ['ART']}, {department: ['ART']}),
            'the same department is equal to itself')

        st.false(
            compareCourse({department: ['ART']}, {department: ['ART', 'ASIAN']}),
            'multiple departments are not the same as a single department')

        st.false(
            compareCourse({department: ['ASIAN']}, {department: ['ART']}),
            'different departments are not equal')

        st.false(
            compareCourse({department: ['CHEM', 'BIO']}, {department: ['BIO', 'CHEM']}),
            'order is significant')

        st.end()
    })

    t.test('compares the "semester" prop', (st) => {
        st.true(
            compareCourse({semester: 1}, {semester: 1}),
            'the same semester is equal to itself')

        st.false(
            compareCourse({semester: 2}, {semester: 1}),
            'different semesters are not equal')

        st.end()
    })

    t.test('compares the "year" prop', (st) => {
        st.true(
            compareCourse({year: 2014}, {year: 2014}),
            'the same year is equal to itself')

        st.false(
            compareCourse({year: 2014}, {year: 2015}),
            'different years are not equal')

        st.end()
    })

    t.test('compares the "number" prop', (st) => {
        st.true(
            compareCourse({number: 201}, {number: 201}),
            'the same number is equal to itself')
        st.true(
            compareCourse({number: 0}, {number: 0}),
            'zero is equal')
        st.true(
            compareCourse({number: 0}, {number: -0}),
            'zero equals negative zero')
        st.false(
            compareCourse({number: 0}, {number: 1}),
            'zero is not one')
        st.false(
            compareCourse({number: Infinity}, {number: -Infinity}),
            'infinity is not negative infinity')
        st.true(
            compareCourse({number: Infinity}, {number: Infinity}),
            'infinity equals infinity')

        st.end()
    })

    t.test('compares the "level" prop', (st) => {
        st.true(
            compareCourse({level: 100}, {level: 100}),
            'the same level is equal to itself')
        st.false(
            compareCourse({level: 100}, {level: 200}),
            'different levels are different')

        st.end()
    })

    t.test('compares the "international" prop', (st) => {
        st.true(
            compareCourse({international: true}, {international: true}),
            'the same "international" value is equal')
        st.false(
            compareCourse({international: true}, {international: false}),
            'different values are different')

        st.end()
    })

    t.test('compares the "lab" prop', (st) => {
        st.true(
            compareCourse({lab: true}, {lab: true}),
            'the same "lab" value is equal')
        st.false(
            compareCourse({lab: true}, {lab: false}),
            'different "lab" values are different')

        st.end()
    })

    t.test('compares the "section" prop', (st) => {
        st.true(
            compareCourse({section: 'A'}, {section: 'A'}),
            'the same section is equal')
        st.false(
            compareCourse({section: 'A'}, {section: 'B'}),
            'different sections are different')

        st.end()
    })

    t.end()
})
