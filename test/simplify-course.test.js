import tape from 'tape'
import simplifyCourse from '../lib/simplify-course'

tape.test('simplifyCourse', (t) => {
    t.equal(simplifyCourse({department: ['CSCI'], number: 121, year: 2014}), 'CSCI 121', 'only uses department and number')
    t.equal(simplifyCourse({department: ['AS', 'RE'], number: 121}), 'AS/RE 121', 'joins multiple departments with a slash')
    t.equal(simplifyCourse({department: ['CH', 'BI'], number: 121}), 'BI/CH 121', 're-sorts departments')

    t.end()
})
