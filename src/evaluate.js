#!/usr/bin/env node

/* @flow */

import all from 'lodash/collection/all'
import any from 'lodash/collection/any'
import filter from 'lodash/collection/filter'
import includes from 'lodash/collection/includes'
import identity from 'lodash/utility/identity'
import map from 'lodash/collection/map'
import mapValues from 'lodash/object/mapValues'
import max from 'lodash/math/max'
import min from 'lodash/math/min'
import pluck from 'lodash/collection/pluck'
import reduce from 'lodash/collection/reduce'
import reject from 'lodash/collection/reject'
import size from 'lodash/collection/size'
import sum from 'lodash/math/sum'
import union from 'lodash/array/union'
import uniq from 'lodash/array/uniq'

import fs from 'graceful-fs'

// - [ ] support "x from children" modifier
// - [ ] write tests


class RequiredKeyError extends Error {
    constructor({keys=[], msg='', data={}}) {
        super()
        this.value = keys || msg
        this.data = data
    }

    toString() {
        return `missing keys: ${this.value} (from ${self.data})`
    }
}


class UnknownPropertyError extends Error {
    constructor(value) {
        super()
        this.value = value
    }

    toString() {
        return `unknown value: ${this.value}`
    }
}


class BadTypeError extends Error {
    constructor({msg='', data={}}) {
        super(msg)
        this.value = msg
        this.data = data
    }

    toString() {
        return `${this.value} ${this.data}`
    }
}


// Helper Functions

function isRequirement(name: string): boolean {
    return /^[A-Z]|[0-9][A-Z\- ]/.test(name)
}


function compareCourse(course: Object, to: Object): boolean {
    // course might have more keys than the dict we're comparing it to
    // 'to' will have some combination of 'year', 'semester', 'department', 'number', and 'section'
    for (const key of ['year', 'semester', 'department', 'number', 'section'])
        if (includes(to, key) && course[key] !== to[key])
            return false
    return true
}


function checkForCourse(filter: Object, courses: Array<Object>): boolean {
    return any(courses, (c) => compareCourse(c, filter))
}


function getOccurrences(course: Object, courses: Array<Object>) {
    return filter(courses, (c) => compareCourse(c, filter))
}


function assertKeys(dict: Object, ...keys): void {
    const missingKeys = reject(keys, key => includes(Object.keys(dict), key))
    if (missingKeys.length) {
        throw new RequiredKeyError({keys: missingKeys, data: dict})
    }
}


function countCourses(courses: Array<Object>): number {
    // courses::pluck('crsid')::uniq()::len()
    return size(uniq(pluck(courses, 'crsid')))
}


function countDepartments(courses: Array<Object>): number {
    // courses::pluck('departments')::sum()
    return sum(pluck(courses, 'departments'))
}


function countCredits(courses: Array<Object>): number {
    console.log('counting credits')
    return sum(pluck(courses, 'credits'))
}


function pathToOverride(path: Array<string>): string {
    return path.join('.').toLowerCase()
}


function hasOverride(path: Array<string>, overrides: Object): boolean {
    return pathToOverride(path) in overrides
}


function getOverride(path: Array<string>, overrides: Object): any {
    return overrides[pathToOverride(path)]
}


function findOperatorType(operator: Object): string {
    if ('$eq' in operator) {
        return '$eq'
    }
    else if ('$ne' in operator) {
        return '$ne'
    }
    else if ('$lt' in operator) {
        return '$lt'
    }
    else if ('$lte' in operator) {
        return '$lte'
    }
    else if ('$gt' in operator) {
        return '$gt'
    }
    else if ('$gte' in operator) {
        return '$gte'
    }
    else {
        throw new RequiredKeyError({
            msg:'no valid operators ($eq, $ne, $lt, $lte, $gt, $gte) could be found',
            data:operator})
    }
}


function compareCourseAgainstOperator(course: Object, key: string, operator: Object): boolean {
    // key: gereqs, operator: {$eq: "EIN"}
    // key: year, operator: {
    //     "$type": "operator",
    //     "$lte": {
    //       "$name": "max",
    //       "$prop": "year",
    //       "$type": "function",
    //       "$where": [{
    //         "$type": "qualification", "gereqs": {
    //           "$type": "operator", "$eq": "BTS-T"
    //         }
    //       }]
    //     }
    // } }

    const kind = findOperatorType(operator)

    if (typeof operator[kind] === 'object') {
        // we compute the value of the function-over-where-query style operators
        // earlier, in the filterByQualification function.
        assertKeys(operator[kind], '$computed-value')
        const simplifiedOperator = {kind: operator[kind]['$computed-value']}
        return compareCourseAgainstOperator(course, key, simplifiedOperator)
    }

    else if (typeof operator[kind] === 'array') {
        throw new BadTypeError({
            msg: `what would a comparison to a list even do? oh, wait; i
            suppose it could compare against one of several values... well, im
            not doing that right now. if you want it, edit the PEG and stick
            appropriate stuff in here (probably simplest to just call this
            function again with each possible value and return true if any are
            true.)`
        })
    }

    else {
        // it's a static value; a number or string
        if (kind === '$eq' || kind === '$ne')
            return (typeof course[key] === 'array'
                    ? course[key] === operator[kind]
                    : includes(course[key], operator[kind]))
        else if (kind === '$ne')
            return (typeof course[key] === 'array'
                    ? course[key] !== operator[kind]
                    : !includes(course[key], operator[kind]))
        else if (kind === '$lt')
            return course[key] < operator[kind]
        else if (kind === '$lte')
            return course[key] <= operator[kind]
        else if (kind === '$gt')
            return course[key] > operator[kind]
        else if (kind === '$gte')
            return course[key] >= operator[kind]
    }
}


function filterByQualification(list: Array<Object>, qualification: Object) {
    // { "$type":"qualification", $key: "gereqs", $value: {"$type": "operator", "$eq": "EIN"} }
    // { "$type":"qualification", $key: "year", value: {
    //     "$type": "operator",
    //     "$lte": {
    //       "$name": "max",
    //       "$prop": "year",
    //       "$type": "function",
    //       "$where": {
    //         "$type": "qualification", $key: "gereqs", $value: {
    //           "$type": "operator", "$eq": "BTS-T"
    //         }
    //       }
    //     }
    // } }

    const operator = qualification['$value']
    const kind = findOperatorType(operator)

    if (typeof operator[kind] === 'object') {
        const value = operator[kind]
        if (value['$type'] === 'function') {
            let func = undefined
            if (value['$name'] === 'max')
                func = max
            else if (value['$name'] === 'min')
                func = min
            else
                throw new RequiredKeyError({msg:`${value['$name']} is not a valid function to call.`})
            const filtered = filterByWhereClause(list, value['$where'])
            const items = pluck(value['$prop'], filtered)
            const computed = func(items)
            value['$computed-value'] = computed
        }
    }

    console.log(qualification)
    const key = qualification['$key']
    const filtered = filter(list, course => compareCourseAgainstOperator(course, key, operator))

    console.log(list.length, filtered.length)
    return filtered
}


function filterByWhereClause(list: Array<Object>, clause: Object) {
    // {gereqs = EIN & year <= max(year) from {gereqs = BTS-T}}
    // {
    //    "$type": "boolean",
    //    "$and": [
    //      { "$type":"qualification", $key: "gereqs", $value: {"$type": "operator", "$eq": "EIN"} },
    //      { "$type":"qualification", $key: "year", $value: {
    //          "$type": "operator",
    //          "$lte": {
    //            "$name": "max",
    //            "$prop": "year",
    //            "$type": "function",
    //            "$where": {
    //              "$type": "qualification", $key: "gereqs", $value: {
    //                "$type": "operator", "$eq": "BTS-T"
    //              }
    //            }
    //          }
    //      } }
    //    ]
    //  }

    if (clause['$type'] === 'qualification') {
        return filterByQualification(list, clause)
    }

    else if (clause['$type'] === 'boolean') {
        if ('$and' in clause) {
            let filtered = list
            clause['$and'].forEach(q => {
                filtered = filterByWhereClause(filtered, q)
            })
            return filtered
        }

        else if ('$or' in clause) {
            let filtrations = []
            clause['$or'].forEach(q => {
                filtrations = union(filtrations, filterByWhereClause(list, q))
            })
            return uniq(filtrations, 'crsid')
        }

        else {
            throw new RequiredKeyError({msg:'neither $or nor $and could be found', data:clause})
        }
    }

    else {
        console.log(clause)
        throw new BadTypeError({msg:'wth kind of type is this clause?', data:clause})
    }
}


// Compute Functions:
// There are two types of compute functions: those that need the surrounding
// context, and those that don't.


// Contained Computes:
// course, occurrence, where

function computeCourse(expr: Object, courses: Array<Object>): boolean {
    const query = expr
    delete query['$type']
    return checkForCourse(query, courses)
}


function computeOccurrence(expr: Object, courses: Array<Object>): boolean {
    assertKeys(expr, '$course', '$count')
    const clause = expr
    delete clause['department']
    delete clause['number']
    delete clause['section']
    const filtered = getOccurrences(clause, courses)
    return filtered.length >= expr['$count']
}


function computeWhere(expr: Object, courses: Array<Object>): boolean {
    assertKeys(expr, '$where', '$count')
    const filtered = filterByWhereClause(courses, expr['$where'])
    expr['_matches'] = filtered
    return filtered.length >= expr['$count']
}


// Contextual Computes:
// boolean, modifier, of, reference

function computeBoolean(expr: Object, ctx: Object, courses: Array<Object>): boolean {
    if ('$or' in expr)
        return any(map(expr['$or'], req => computeChunk(req, ctx, courses)))
    else if ('$and' in expr)
        return all(map(expr['$and'], req => computeChunk(req, ctx, courses)))
    else if ('$not' in expr)
        return !(computeChunk(expr['$not'], ctx, courses))
    else {
        console.log()
        console.log(expr)
        throw new RequiredKeyError({msg:'none of $or, $and, or $not could be found'})
    }
}


function computeOf(expr: Object, ctx: Object, courses: Array<Object>): boolean {
    assertKeys(expr, '$of', '$count')

    const evaluated = map(expr['$of'], req => computeChunk(req, ctx, courses))
    const truthy = filter(evaluated, identity)
    return truthy.length >= expr['$count']
}


function computeReference(expr: Object, ctx: Object, courses: Array<Object>): boolean {
    assertKeys(expr, '$requirement')
    if (expr['$requirement'] in ctx ){
        const target = ctx[expr['$requirement']]
        return target['computed']
    }
    else
        return false
}


function computeModifier(expr: Object, ctx: Object, courses: Array<Object>): boolean {
    assertKeys(expr, '$what', '$count', '$from')
    const what = expr['$what']

    if (!includes(['course', 'department', 'credit'], what))
        throw new UnknownPropertyError(what)

    if (expr['$from'] === 'children') {
        console.error('not yet implemented')
        return false
    }

    else if (expr['$from'] === 'where') {
        assertKeys(expr, '$where', '$count')
        const filtered = filterByWhereClause(courses, expr['$where'])
        let num = undefined

        if (what === 'course')
            num = countCourses(filtered)
        else if (what === 'department')
            num = countDepartments(filtered)
        else if (what === 'credit')
            num = countCredits(filtered)

        return num >= expr['$count']
    }
}


// And, of course, the function that dispatches the appropriate compute:

function computeChunk(expr: Object, ctx: Object, courses: Array<Object>): boolean {
    // print
    // print 'expression:', expr
    // print 'context:', ctx

    assertKeys(expr, '$type')
    const type = expr['$type']

    let computed = false
    if (type === 'boolean')
        computed = computeBoolean(expr, ctx, courses)
    else if (type === 'course')
        computed = computeCourse(expr, courses)
    else if (type === 'modifier')
        computed = computeModifier(expr, ctx, courses)
    else if (type === 'occurrence')
        computed = computeOccurrence(expr, courses)
    else if (type === 'of')
        computed = computeOf(expr, ctx, courses)
    else if (type === 'reference')
        computed = computeReference(expr, ctx, courses)
    else if (type === 'where')
        computed = computeWhere(expr, courses)

    expr['_result'] = computed
    return computed
}


// The overall computation === done by compute, which === in charge of computing
// sub-requirements and such.

function compute(requirement: Object, path: Array<string>, courses=[], overrides={}): Object {
    // this_name = path[-1]
    // print ''
    // print requirement, this_name

    requirement = mapValues(requirement, (req, name) => {
        return isRequirement(name)
            ? compute(req, path.concat([name]), courses, overrides)
            : req
    })

    let computed = false

    if ('result' in requirement) {
        computed = computeChunk(requirement['result'], requirement, courses)
    }

    else if ('message' in requirement) {
        computed = false
        // show a button to toggle overriding
    }

    else {
        // throw new RequiredKeyError(msg='one of message or result === required')
        print('one of message or result === required')
    }

    requirement['computed'] = computed

    if (hasOverride(path, overrides)) {
        requirement['overridden'] = true
        requirement['computed'] = getOverride(path, overrides)
    }

    return requirement
}


export function evaluate(student: Object, area: Object): Object {
    assertKeys(area, 'name', 'result', 'type', 'revision')
    const {courses, overrides} = student
    const {name, type} = area
    return compute(area, [type, name], courses, overrides)
}

function loadFile(filename) {
    const data = fs.readFileSync(filename, 'utf-8')
    return JSON.parse(data)
}

function main() {
    if (process.argv.length < 3) {
        console.log('usage: evaluate areaFile [student]')
        return
    }

    let areaFile, studentFile
    if (process.argv.length >= 3) {
        areaFile = process.argv[2]
        studentFile = process.argv[3] || './student.json'
    }

    const {courses, overrides} = loadFile(studentFile)

    const result = evaluate({courses, overrides}, loadFile(areaFile))
    // evaluate('', '')

    console.log(JSON.stringify(result, null, 2))
    console.log('outcome:', result['computed'])
}

main()
