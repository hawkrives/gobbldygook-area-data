# compute.py
# coding: utf-8
import re
import pprint
from functools import reduce
from data import data, overrides

# - [x] support where queries
# - [ ] support "x from children" modifier
# - [ ] write tests


class RequiredKeyException(Exception):
    def __init__(self, keys=[], msg='', data={}):
        self.value = keys or msg
        self.data = data

    def __str__(self):
        return 'missing keys: ' + repr(self.value) + str(self.data)


class UnknownPropertyException(Exception):
    def __init__(self, value):
        self.value = value

    def __str__(self):
        return 'unknown value: ' + repr(self.value)


class BadTypeException(Exception):
    def __init__(self, msg, data):
        self.value = msg
        self.data = data

    def __str__(self):
        return self.value + ' ' + repr(self.data)


def pluck(list, prop):
    return [i[prop]
            for i in list
            if prop in i]


def add(a, b):
    return a + b


def sum(iter):
    return reduce(add, iter, 0)


# Helper Functions

def isRequirement(name):
    return bool(re.match(r'[A-Z]|[0-9][A-Z\- ]', name))


def compare_course(course, to):
    # course might have more keys than the dict we're comparing it to
    # 'to' will have some combination of 'year', 'semester', 'department', 'number', and 'section'
    for key in ['year', 'semester', 'department', 'number', 'section']:
        if key in to and course[key] != to[key]:
            return False
    return True


def checkForCourse(filter, courses):
    return any([c for c in courses if compare_course(course=c, to=filter)])


def get_occurrences(course, courses):
    return [c for c in courses if compare_course(course=c, to=filter)]


def assertKeys(dict, *keys):
    missingKeys = [key
                   for key in keys
                   if key not in dict]
    if missingKeys:
        raise RequiredKeyException(keys=missingKeys, data=dict)


def countCourses(courses):
    # courses::pluck('crsid')::uniq()::len()
    return len(set(pluck(courses, 'crsid')))


def countDepartments(courses):
    # courses::pluck('departments')::sum()
    return sum(pluck(courses, 'departments'))


def countCredits(courses):
    return sum(pluck(courses, 'credits'))


def pathToOverride(path):
    return '.'.join(path).lower()


def hasOverride(path, overrides):
    return pathToOverride(path) in overrides


def getOverride(path, overrides):
    return overrides[pathToOverride(path)]


def findOperatorType(operator):
    if '$eq' in operator:
        return '$eq'
    elif '$ne' in operator:
        return '$ne'
    elif '$lt' in operator:
        return '$lt'
    elif '$lte' in operator:
        return '$lte'
    elif '$gt' in operator:
        return '$gt'
    elif '$gte' in operator:
        return '$gte'
    else:
        raise RequiredKeyException(
            msg='no valid operators ($eq, $ne, $lt, $lte, $gt, $gte) could be found',
            data=operator)


def compareCourseAgainstOperator(course, key, operator):
    # key: gereqs, operator: {$eq: "EIN"}
    # key: year, operator: {
    #     "$type": "operator",
    #     "$lte": {
    #       "$name": "max",
    #       "$prop": "year",
    #       "$type": "function",
    #       "$where": [{
    #         "$type": "qualifier", "gereqs": {
    #           "$type": "operator", "$eq": "BTS-T"
    #         }
    #       }]
    #     }
    # } }

    kind = findOperatorType(operator)

    if type(operator[kind]) is dict:
        # we compute the value of the function-over-where-query style operators
        # earlier, in the filterByQualifier function.
        assertKeys(operator[kind], '$computed-value')
        simplifiedOperator = {kind: operator[kind]['$computed-value']}
        return compareCourseAgainstOperator(course, key, simplifiedOperator)

    elif type(operator[kind]) is list:
        raise BadTypeException(msg='''what would a comparison to a list even
        do? oh, wait; i suppose it could compare against one of several
        values... well, im not doing that right now. if you want it, edit the
        PEG and stick appropriate stuff in here (probably simplest to just
        call this function again with each possible value and return true if
        any are true.)''')

    else:
        # it's a static value; a number or string
        if kind == '$eq':
            return (course[key] == operator[kind]
                    if type(course[key]) is not list
                    else operator[kind] in course[key])
        elif kind == '$ne':
            return (course[key] != operator[kind]
                    if type(course[key]) is not list
                    else operator[kind] not in course[key])
        elif kind == '$lt':
            return course[key] < operator[kind]
        elif kind == '$lte':
            return course[key] <= operator[kind]
        elif kind == '$gt':
            return course[key] > operator[kind]
        elif kind == '$gte':
            return course[key] >= operator[kind]


def filterByQualifier(list, qualifier):
    # { "$type":"qualifier", $key: "gereqs", $value: {"$type": "operator", "$eq": "EIN"} }
    # { "$type":"qualifier", $key: "year", value: {
    #     "$type": "operator",
    #     "$lte": {
    #       "$name": "max",
    #       "$prop": "year",
    #       "$type": "function",
    #       "$where": {
    #         "$type": "qualifier", $key: "gereqs", $value: {
    #           "$type": "operator", "$eq": "BTS-T"
    #         }
    #       }
    #     }
    # } }

    operator = qualifier['$value']
    kind = findOperatorType(operator)

    if type(operator[kind]) is dict:
        value = operator[kind]
        if value['$type'] == 'function':
            func = None
            if value['$name'] == 'max':
                func = max
            elif value['$name'] == 'min':
                func = min
            filtered = filterfilterByWhereClause(value['$where'])
            items = pluck(value['$prop'], filtered)
            computed = func(items)
            value['$computed-value'] = computed

    print qualifier
    key = qualifier['$key']
    operator = qualifier['$value']
    filtered = [course
                for course in list
                if compareCourseAgainstOperator(course, key, operator)]

    print len(list), len(filtered)
    return filtered


def filterByWhereClause(list, clause):
    # {gereqs = EIN & year <= max(year) from {gereqs = BTS-T}}
    # {
    #    "$type": "boolean",
    #    "$and": [
    #      { "$type":"qualifier", $key: "gereqs", $value: {"$type": "operator", "$eq": "EIN"} },
    #      { "$type":"qualifier", $key: "year", $value: {
    #          "$type": "operator",
    #          "$lte": {
    #            "$name": "max",
    #            "$prop": "year",
    #            "$type": "function",
    #            "$where": {
    #              "$type": "qualifier", $key: "gereqs", $value: {
    #                "$type": "operator", "$eq": "BTS-T"
    #              }
    #            }
    #          }
    #      } }
    #    ]
    #  }

    if clause['$type'] == 'qualifier':
        return filterByQualifier(list, clause)

    elif clause['$type'] == 'boolean':
        if '$and' in clause:
            filtered = list
            for q in clause['$and']:
                filtered = filterByWhereClause(filtered, q)
            return filtered

        elif '$or' in clause:
            filtrations = set()
            for q in clause['$or']:
                filtrations = filtrations.union(filterByWhereClause(list, q))
            return filtrations

        else:
            raise RequiredKeyException(msg='neither $or nor $and could be found', data=clause)

    else:
        raise BadTypeException(msg='wth kind of type is this clause?', data=clause)


# Compute Functions:
# There are two types of compute functions: those that need the surrounding
# context, and those that don't.


# Contained Computes:
# course, occurrence, where

def compute_course(expr, courses):
    query = {key: value
             for key, value in expr.items()
             if key not in ['$type']}
    return checkForCourse(filter=query, courses=courses)


def compute_occurrence(expr, courses):
    assertKeys(expr, '$course', '$count')
    clause = {key: val
              for key, val in expr['$course']
              if key in ['department', 'number', 'section']}
    filtered = get_occurrences(clause, courses)
    return len(filtered) >= expr['$count']


def compute_where(expr, courses):
    assertKeys(expr, '$where', '$count')
    filtered = filterByWhereClause(courses, expr['$where'])
    expr['_matches'] = filtered
    return len(filtered) >= expr['$count']


# Contextual Computes:
# boolean, modifier, of, reference

def compute_boolean(expr, ctx, courses):
    if '$or' in expr:
        return any([compute_chunk(req, ctx, courses) for req in expr['$or']])
    elif '$and' in expr:
        return all([compute_chunk(req, ctx, courses) for req in expr['$and']])
    elif '$not' in expr:
        return not (compute_chunk(expr['$not'], ctx, courses))
    else:
        print
        print result
        raise RequiredKeyException(msg='none of $or, $and, or $not could be found')


def compute_of(expr, ctx, courses):
    assertKeys(expr, '$of', '$count')

    evaluated = [compute_chunk(req, ctx, courses)
                 for req in expr['$of']]
    truthy = [i for i in evaluated if i]
    return len(truthy) >= expr['$count']


def compute_reference(expr, ctx, courses):
    assertKeys(expr, '$requirement')
    if expr['$requirement'] in ctx:
        target = ctx[expr['$requirement']]
        return target['computed']
    else:
        return False


def compute_modifier(expr, ctx, courses):
    assertKeys(expr, '$what', '$count', '$from')
    what = expr['$what']

    if what not in ['course', 'department', 'credit']:
        raise UnknownPropertyException(what)

    if expr['$from'] == 'children':
        return 'not yet implemented'

    elif expr['$from'] == 'where':
        assertKeys(expr, '$where', '$count')
        filtered = filterByWhereClause(courses, expr['$where'])

        if what == 'course':
            num = countCourses(filtered)
        elif what == 'department':
            num = countDepartments(filtered)
        elif what == 'credit':
            num = countCredits(filtered)

        return num >= expr['$count']


# And, of course, the function that dispatches the appropriate compute:

def compute_chunk(expr, ctx, courses):
    # print
    # print 'expression:', expr
    # print 'context:', ctx

    assertKeys(expr, '$type')
    type = expr['$type']

    computed = False
    if type == 'boolean':
        computed = compute_boolean(expr, ctx, courses)
    elif type == 'course':
        computed = compute_course(expr, courses)
    elif type == 'modifier':
        computed = compute_modifier(expr, ctx, courses)
    elif type == 'occurrence':
        computed = compute_occurrence(expr, courses)
    elif type == 'of':
        computed = compute_of(expr, ctx, courses)
    elif type == 'reference':
        computed = compute_reference(expr, ctx, courses)
    elif type == 'where':
        computed = compute_where(expr, courses)

    expr['_result'] = computed
    return computed


# The overall computation is done by compute, which is in charge of computing
# sub-requirements and such.

def compute(requirement, path, courses=[], overrides={}):
    this_name = path[-1]
    # print ''
    # print requirement, this_name

    requirement = {
        name: compute(req, path+[name], courses, overrides)
        if isRequirement(name)
        else req
        for name, req in requirement.items()
    }

    computed = False

    if 'result' in requirement:
        computed = compute_chunk(requirement['result'], requirement, courses)
    # requirement['result'] = result

    elif 'message' in requirement:
        computed = False
        # show a button to toggle overriding
        pass

    else:
        # raise RequiredKeyException(msg='one of message or result is required')
        print('one of message or result is required')

    requirement['computed'] = computed

    if hasOverride(path, overrides):
        requirement['overridden'] = True
        requirement['computed'] = getOverride(path, overrides)

    return requirement


def main():
    assertKeys(data, 'name', 'result', 'type', 'revision')

    name = data['name']
    type = data['type']

    courses = [
        {"department": ["ART"], "number": 102},
        {"department": ["ART"], "number": 103},
        {"department": ["ART"], "number": 104},
        {"department": ["ART"], "number": 106},
        {"department": ["ART"], "number": 205},
        {"department": ["ART"], "number": 207},
        {"department": ["ART"], "number": 221},
        {"department": ["ART"], "number": 222},
        {"department": ["ART"], "number": 223},
        {"department": ["ART"], "number": 224},
        {"department": ["ART"], "number": 225},
        {"department": ["ART"], "number": 226},
        {"department": ["ART"], "number": 227},
        {"department": ["ART"], "number": 228},
        {"department": ["ART"], "number": 229},
        {"department": ["ART"], "number": 232},
        {"department": ["ART"], "number": 233},
        {"department": ["ART"], "number": 234},
        {"department": ["ART"], "number": 236},
        {"department": ["ART"], "number": 238},
        {"department": ["ART"], "number": 343},
        {'department': ['ART'], 'number': 398},
        {'department': ['ART', 'ASIAN'], 'number': 259},
        {'department': ['CSCI'], 'number': 241},
    ]

    pp = pprint.PrettyPrinter(width=40, indent=2)

    c = compute(requirement=data, path=[type, name], courses=courses, overrides=overrides)

    # print pprint.pformat(c, indent=2)
    print 'outcome:', c['computed']
    # print data


if __name__ == "__main__":
    main()
