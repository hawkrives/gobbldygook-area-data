import evaluate, {
    assertKeys,
    checkForCourse,
    compareCourse,
    compareCourseAgainstOperator,
    compute,
    computeBoolean,
    computeChunk,
    computeCourse,
    computeModifier,
    computeOccurrence,
    computeOf,
    computeReference,
    computeWhere,
    countCourses,
    countCredits,
    countDepartments,
    filterByQualification,
    filterByWhereClause,
    findOperatorType,
    getDepartments,
    getOccurrences,
    getOverride,
    hasOverride,
    pathToOverride,
    RequiredKeyError,
} from '../src/evaluate'
import isRequirementName from '../src/isRequirementName'

describe('isRequirementName', () => {
    it('checks if a string is a valid requirement name', () => {
        expect(isRequirementName('0')).to.be.true
        expect(isRequirementName('BTS-B')).to.be.true
        expect(isRequirementName('Studio Art')).to.be.true
        expect(isRequirementName('_A0')).to.be.false
    })
})

describe('compareCourse', () => {
    it(`compares select keys of courses`, () => {
        expect(compareCourse({
            department: ['ART'],
            number: 310,
        }, {
            department: ['ART'],
            number: 310,
        })).to.be.true
    })

    it('compares empty objects to be equal', () => {
        expect(compareCourse({}, {})).to.be.true
    })

    it('compares the course prop "department"', () => {
        expect(compareCourse({department: ['ART']}, {department: ['ART']})).to.be.true
        expect(compareCourse({department: ['ART']}, {department: ['ART', 'ASIAN']})).to.be.false
        expect(compareCourse({department: ['ASIAN']}, {department: ['ART']})).to.be.false
        expect(compareCourse({department: ['CHEM', 'BIO']}, {department: ['BIO', 'CHEM']})).to.be.false
    })
    it('compares the course prop "semester"', () => {
        expect(compareCourse({semester: 1}, {semester: 1})).to.be.true
        expect(compareCourse({semester: 2}, {semester: 1})).to.be.false
    })
    it('compares the course prop "year"', () => {
        expect(compareCourse({year: 2014}, {year: 2014})).to.be.true
        expect(compareCourse({year: 2014}, {year: 2015})).to.be.false
    })
    it('compares the course prop "number"', () => {
        expect(compareCourse({number: 201}, {number: 201})).to.be.true
        expect(compareCourse({number: 0}, {number: 0})).to.be.true
        expect(compareCourse({number: 0}, {number: -0})).to.be.true
        expect(compareCourse({number: 0}, {number: 1})).to.be.false
        expect(compareCourse({number: Infinity}, {number: -Infinity})).to.be.false
        expect(compareCourse({number: Infinity}, {number: Infinity})).to.be.true
    })
    it('compares the course prop "level"', () => {
        expect(compareCourse({level: 100}, {level: 100})).to.be.true
        expect(compareCourse({level: 100}, {level: 200})).to.be.false
    })
    it('compares the course prop "international"', () => {
        expect(compareCourse({international: true}, {international: true})).to.be.true
        expect(compareCourse({international: true}, {international: false})).to.be.false
    })
    it('compares the course prop "lab"', () => {
        expect(compareCourse({lab: true}, {lab: true})).to.be.true
        expect(compareCourse({lab: true}, {lab: false})).to.be.false
    })
    it('compares the course prop "section"', () => {
        expect(compareCourse({section: 'A'}, {section: 'A'})).to.be.true
        expect(compareCourse({section: 'A'}, {section: 'B'})).to.be.false
    })
})

xdescribe('checkForCourse', () => {
    xit('checks for a course in an array of courses', () => {})
})

xdescribe('getOccurrences', () => {
    xit('returns a list of occurrences of a given course from another array of courses', () => {})
})

describe('assertKeys', () => {
    it('assert that some keys are present in an object', () => {
        expect(() => assertKeys({a: 1}, 'a')).not.to.throw()
        expect(() => assertKeys({a: 1}, 'b')).to.throw()
    })
})

describe('countCourses', () => {
    it('counts the number of distinct courses in an array', () => {
        const courses = [
            {crsid: 310},
            {crsid: 311},
            {crsid: 310},
        ]
        expect(countCourses(courses)).to.equal(2)
    })
})

describe('getDepartments', () => {
    it('returns the distinct departments from an array of courses', () => {
        const courses = [
            {department: ['ART']},
            {department: ['ART', 'ASIAN']},
            {department: ['CHEM', 'BIO']},
        ]
        expect(getDepartments(courses)).to.deep.equal(['ART', 'ASIAN', 'CHEM', 'BIO'])
    })
})

describe('countDepartments', () => {
    it('counts the number of distinct departments in an array of courses', () => {
        const courses = [
            {department: ['ART']},
            {department: ['ART', 'ASIAN']},
            {department: ['CHEM', 'BIO']},
        ]
        expect(countDepartments(courses)).to.equal(4)
    })
})

describe('countCredits', () => {
    it('counts the number of credits in an array of courses', () => {
        const courses = [
            {credits: 1.0},
            {credits: 1.5},
            {credits: 1.5},
        ]
        expect(countCredits(courses)).to.equal(4.0)
    })
})

describe('pathToOverride', () => {
    it('computes the path to an override', () => {
        expect(pathToOverride(['a', 'b', 'c d'])).to.equal('a.b.c d')
    })
    it('lower-cases the path', () => {
        expect(pathToOverride(['aA', 'b', 'c d'])).to.equal('aa.b.c d')
    })
    it('retains spaces in the path', () => {
        expect(pathToOverride(['aA', 'b', 'Studio aRt'])).to.equal('aa.b.studio art')
    })
})

describe('hasOverride', () => {
    it('checks if an override exists', () => {
        expect(hasOverride(['a', 'b', 'c'], {'a.b.c': true})).to.be.true
    })
    it('doesn\'t just return the value of the override', () => {
        expect(hasOverride(['a', 'b', 'c'], {'a.b.c': false})).to.be.true
    })
})

describe('getOverride', () => {
    it('returns an override', () => {
        expect(getOverride(['a', 'b', 'c'], {'a.b.c': true})).to.equal(true)
    })
    it('simply returns the value of the override', () => {
        expect(getOverride(['a', 'b', 'c'], {'a.b.c': false})).to.equal(false)

        const arr = [1, 2, 3]
        expect(getOverride(['a', 'b', 'c'], {'a.b.c': arr})).to.equal(arr)
    })
})

describe('findOperatorType', () => {
    it('returns the type of an operator', () => {
        expect(findOperatorType({$eq: 1})).to.equal('$eq')
    })
    it('throws if operator does not contain a valid type', () => {
        expect(() => findOperatorType({'$bad-op': 'stuff'})).to.throw(RequiredKeyError)
    })
})

describe('compareCourseAgainstOperator', () => {
    it('compares a course property against an operator', () => {
        const course = {department: ['ART'], number: 310}
        expect(compareCourseAgainstOperator(course, 'number', {$eq: 310})).to.be.true
    })

    it('supports $eq', () => {
        const course = {department: ['ART'], number: 310}
        expect(compareCourseAgainstOperator(course, 'number', {$eq: 310})).to.be.true
    })

    it('supports $ne', () => {
        const course = {department: ['ART'], number: 310}
        expect(compareCourseAgainstOperator(course, 'number', {$ne: 210})).to.be.true
        expect(compareCourseAgainstOperator(course, 'number', {$ne: 310})).to.be.false
    })

    it('supports $lt', () => {
        const course = {department: ['ART'], number: 200}
        expect(compareCourseAgainstOperator(course, 'number', {$lt: 300})).to.be.true
        expect(compareCourseAgainstOperator(course, 'number', {$lt: 100})).to.be.false
    })

    it('supports $lte', () => {
        const course = {department: ['ART'], number: 310}
        expect(compareCourseAgainstOperator(course, 'number', {$lte: 310})).to.be.true
        expect(compareCourseAgainstOperator(course, 'number', {$lte: 200})).to.be.false
    })

    it('supports $gt', () => {
        const course = {department: ['ART'], number: 300}
        expect(compareCourseAgainstOperator(course, 'number', {$gt: 200})).to.be.true
        expect(compareCourseAgainstOperator(course, 'number', {$gt: 400})).to.be.false
    })

    it('supports $gte', () => {
        const course = {department: ['ART'], number: 310}
        expect(compareCourseAgainstOperator(course, 'number', {$gte: 310})).to.be.true
        expect(compareCourseAgainstOperator(course, 'number', {$gte: 400})).to.be.false
    })

    it('compares checks for items within arrays', () => {
        const course = {department: ['ART', 'ASIAN'], number: 310}
        expect(compareCourseAgainstOperator(course, 'department', {$eq: 'ART'})).to.be.true
        expect(compareCourseAgainstOperator(course, 'department', {$eq: 'ASIAN'})).to.be.true
    })

    it('$ne checks if an item does not exist within an array?', () => {
        const course = {department: ['ART', 'ASIAN'], number: 310}
        expect(compareCourseAgainstOperator(course, 'department', {$ne: 'CSCI'})).to.be.true
    })

    it('compares courses against a pre-determined query', () => {
        const course = {department: ['ART', 'ASIAN'], year: 2015}
        const operator = {$lte: {'$computed-value': 2016}}
        expect(compareCourseAgainstOperator(course, 'year', operator)).to.be.true
    })
})

describe('filterByQualification', () => {
    let basicQualification, advancedQualification
    let courses
    beforeEach(() => {
        basicQualification = {
            $type: 'qualification',
            $key: 'gereqs',
            $value: {
                '$type': 'operator',
                '$eq': 'EIN',
            },
        }
        advancedQualification = {
            $type: 'qualification',
            $key: 'year',
            $value: {
                $type: 'operator',
                $lte: {
                    $name: 'max',
                    $prop: 'year',
                    $type: 'function',
                    $where: {
                        $type: 'qualification',
                        $key: 'gereqs',
                        $value: {
                            $type: 'operator',
                            '$eq': 'BTS-T',
                        },
                    },
                },
            },
        }
        courses = [
            {departments: ['ART', 'ASIAN'], number: 310, lab: true, year: 2012},
            {departments: ['ASIAN'], number: 275, year: 2016},
            {departments: ['CSCI'], number: 375, gereqs: ['EIN'], year: 2013},
            {departments: ['REL'], number: 111, section: 'C', gereqs: ['BTS-T'], year: 2012},
            {departments: ['REL'], number: 115, gereqs: ['BTS-T'], year: 2013},
        ]
    })



    it('filters an array of courses by a qualification', () => {
        expect(filterByQualification(courses, basicQualification)).to.deep.equal([
            {departments: ['CSCI'], number: 375, gereqs: ['EIN'], year: 2013},
        ])
    })

    it('filters an array based on a nested where-query', () => {
        expect(filterByQualification(courses, advancedQualification)).to.deep.equal([
            {departments: ['ART', 'ASIAN'], number: 310, lab: true, year: 2012},
            {departments: ['CSCI'], number: 375, gereqs: ['EIN'], year: 2013},
            {departments: ['REL'], number: 111, section: 'C', gereqs: ['BTS-T'], year: 2012},
            {departments: ['REL'], number: 115, gereqs: ['BTS-T'], year: 2013},
        ])
    })
})

describe('filterByWhereClause', () => {
    let clause
    let courses
    beforeEach(() => {
        // {gereqs = EIN & year <= max(year) from courses where {gereqs = BTS-T}}
        /*
            {
                gereqs = EIN &
                year = max(year) from courses where {
                    gereqs = BTS-T &
                    semester = min(semester) from courses where {
                        level = 300
                    }
                }
            }
        */
        clause = {
            $type: 'boolean',
            $and: [
                {
                    $type: 'qualification',
                    $key: 'gereqs',
                    $value: {
                        '$type': 'operator',
                        '$eq': 'EIN',
                    },
                },
                {
                    $type: 'qualification',
                    $key: 'year',
                    $value: {
                        $type: 'operator',
                        $lte: {
                            $name: 'max',
                            $prop: 'year',
                            $type: 'function',
                            $where: {
                                $type: 'qualification',
                                $key: 'gereqs',
                                $value: {
                                    $type: 'operator',
                                    $eq: 'BTS-T',
                                },
                            },
                        },
                    },
                },
            ],
        }

        courses = [
            {departments: ['ART', 'ASIAN'], number: 310, lab: true, year: 2012},
            {departments: ['CSCI'], number: 375, gereqs: ['EIN'], year: 2015},
            {departments: ['REL'], number: 111, section: 'C', gereqs: ['BTS-T'], year: 2012},
            {departments: ['REL'], number: 115, gereqs: ['BTS-T'], year: 2015},
        ]
    })
    it('filters an array of courses by a where-clause', () => {
        expect(filterByWhereClause(courses, clause)).to.deep.equal([
            {departments: ['CSCI'], number: 375, gereqs: ['EIN'], year: 2015},
        ])
    })
})

xdescribe('computeChunk', () => {
    xit('', () => {})
})

xdescribe('computeCourse', () => {
    xit('', () => {})
})

xdescribe('computeOccurrence', () => {
    xit('', () => {})
})

xdescribe('computeWhere', () => {
    xit('', () => {})
})

describe('computeBoolean', () => {
    xit('computes the boolean result of and-clauses', () => {})
    xit('computes the boolean result of or-clauses', () => {})
    it('only computes an or-clause until it has a result', () => {
        const clause = parse('CSCI 121 | 125')
        const requirement = {result: clause}
        const courses = [{department: ['CSCI'], number: 121}, {department: ['CSCI'], number: 125}]

        const result = computeBoolean(clause, requirement, courses)
        expect(clause).to.deep.equal({
            $type: 'boolean',
            $or: [
                {_result: true, $type: 'course', department: ['CSCI'], number: 121},
                {$type: 'course', department: ['CSCI'], number: 125},
            ],
            _matches: [
                {_result: true, $type: 'course', department: ['CSCI'], number: 121},
            ],
        })
        expect(result).to.be.true
    })

    it('computes an or-clause even if the first item is false', () => {
        const clause = parse('CSCI 121 | 125')
        const requirement = {result: clause}
        const courses = [{department: ['CSCI'], number: 151}, {department: ['CSCI'], number: 125}]

        const result = computeBoolean(clause, requirement, courses)
        expect(clause).to.deep.equal({
            $type: 'boolean',
            $or: [
                {_result: false, $type: 'course', department: ['CSCI'], number: 121},
                {_result: true, $type: 'course', department: ['CSCI'], number: 125},
            ],
            _matches: [
                {_result: true, $type: 'course', department: ['CSCI'], number: 125},
            ],
        })
        expect(result).to.be.true
    })
})

xdescribe('computeOf', () => {
    xit('', () => {})
})

xdescribe('computeReference', () => {
    xit('', () => {})
})

xdescribe('computeModifier', () => {
    xit('', () => {})
})

xdescribe('compute', () => {
    xit('', () => {})
})


xdescribe('evaluate', () => {
    let area, courses, overrides
    beforeEach(() => {
        area = {
            name: 'Sample Area',
            type: 'major',
            result: 'Requirement',
        }
        courses = [
            {},
        ]
        overrides = {

        }
    })

    it('evaluates!', () => {
        expect(evaluate({courses, overrides}, area)).to.be.ok()
    })

    // of: stores the number of matches in its containing expression
})
