import collectUsedCourses from '../lib/collect-used-courses'

describe.only('collectUsedCourses', () => {
    it('collects a list of all of the courses anywhere in this object which have the `_used` property.', () => {
        const obj = {
            $type: 'course',
            $course: {
                department: ['ASIAN'],
                number: 120,
            },
            _used: true,
        }

        expect(collectUsedCourses(obj)).to.equal(obj.$course)
    })

    it('can go down several layers deep', () => {
        const obj = {
            $type: 'boolean',
            $or: [
                {
                    $type: 'course',
                    $course: {
                        department: ['ASIAN'],
                        number: 120,
                    },
                    _used: true,
                },
                {
                    $type: 'course',
                    $course: {
                        department: ['ASIAN'],
                        number: 120,
                    },
                    _used: false,
                },
            ],
        }

        expect(collectUsedCourses(obj)).to.deep.equal([
            obj.$or[0].$course,
            obj.$or[1].$course,
        ])
    })

    it('can go down many layers deep', () => {
        const obj = {
            $count: 3,
            $of: [
                {
                    $type: 'of',
                    $count: 1,
                    $of: [
                        {
                            $course: {department: ['CSCI'], number: 120},
                            $type: 'course',
                        },
                        {
                            $course: {department: ['CSCI'], number: 121},
                            $type: 'course',
                        },
                        {
                            $course: {department: ['CSCI'], number: 122},
                            $type: 'course',
                        },
                    ],
                },
                {
                    $count: 2,
                    $type: 'where',
                    $where: {
                        $key: 'gereq',
                        $type: 'qualification',
                        $value: {
                            $eq: 'WRI',
                            $type: 'operator'
                        }
                    }
                },
                {
                    $count: 2,
                    $course: {
                        $course: {
                            department: [
                                'CHEM'
                            ],
                            number: 121
                        },
                        $type: 'course'
                    },
                    $type: 'occurrence'
                },
                {
                    $count: 3,
                    $of: [
                        {
                            $course: {
                                department: [
                                    'ART',
                                    'ASIAN'
                                ],
                                number: 170
                            },
                            $type: 'course'
                        },
                        {
                            $course: {
                                department: [
                                    'ART',
                                    'ASIAN'
                                ],
                                number: 175
                            },
                            $type: 'course'
                        },
                        {
                            $course: {
                                department: [
                                    'ART',
                                    'ASIAN'
                                ],
                                number: 180
                            },
                            $type: 'course'
                        },
                        {
                            $course: {
                                department: [
                                    'ART',
                                    'ASIAN'
                                ],
                                number: 190
                            },
                            $type: 'course'
                        }
                    ],
                    $type: 'of'
                },
                {
                    $count: 3,
                    $of: [
                        {
                            $course: {
                                department: [
                                    'ASIAN'
                                ],
                                number: 210
                            },
                            $type: 'course'
                        },
                        {
                            $course: {
                                department: [
                                    'ASIAN'
                                ],
                                number: 215
                            },
                            $type: 'course'
                        },
                        {
                            $course: {
                                department: [
                                    'ASIAN'
                                ],
                                number: 220
                            },
                            $type: 'course'
                        }
                    ],
                    $type: 'of'
                }
            ],
            $type: 'of'
        }


        expect(collectUsedCourses(obj)).to.deep.equal([
            obj.$or[0].$course,
            obj.$or[1].$course,
        ])
    })
})
