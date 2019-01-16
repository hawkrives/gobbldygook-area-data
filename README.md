# A Declarative Domain-Specific Language for Defining Areas of Study at St. Olaf College

This document outlines the language features of the “Hanson Format”, a domain-specific language (DSL) intended for use in statically defining the requirements for areas of study at St. Olaf College.

An “area of study” is any single degree, major, concentration, or area of emphasis.

Credit for the original impetus for investigating a static format, instead of writing imperative routines for each requirement, is due to Professor Bob Hanson, of the Chemistry Department, who led an independent study into this topic in January of 2015.

# Table of Contents

1. Introduction
1. Sections, Sub-sections, and Requirements
1. Rules
   1. of/count
   1. both/either
   1. course
   1. requirement
   1. given
    1. Types of Input
     1. :courses
     1. :these courses
     1. :these requirements
     1. :areas of study
     1. :$variable
    1. Types of Output
     1. what:courses
     1. what:credits
     1. what:distinct courses
     1. what:grade
     1. what:term
    1. Types of Filters
     1. where:{department}
     1. where:{semester}
     1. where:{level}
     1. where:{institution}
     1. where:{graded}
     1. where:{gereqs}
     1. where:{custom_attribute}
     1. how to use multiple values to search (MCD | MCG)
    1. Types of Actions
     1. do:count
     1. do:sum
     1. do:average
     1. do:minimum
     1. do:difference
    1. Limiters
1. Saving Subsets
1. Global Limits
1. Custom Attributes on Courses
   1. “multiple values can be used”
1. Messages
1. Contracts
1. Department Verification
1. Common Requirements among All Majors
   1. todo(hawken): credits outside of the major?
   1. todo(hawken): how to define common major requirements?
    1. especially since they only apply to B.A. majors
    1. … actually do we need a “ba-major” and “bm-major” type?
    1. are there bm-concentrations? emphases?



# Definitions

> term

A specific year/semester combination; i.e., `2012-1`.

> area of study

A degree, major, concentration, or area of emphasis.

# Sections, Sub-sections, and Requirements

Each area of study is broken down into one or more sections or Requirements.

The top-level of the file must follow the following structure:

```yaml
name: Chemistry
type: degree | major | concentration | emphasis
catalog: 2015-16

result: Rule

requirements:
  < Sections and requirements go here. >
```

Each section consists of either sub-sections or Requirements.

Each Requirement must contain at least the `result` key, which is a Rule (rules are described in the next section.)

## Sections

A Section may contain only the `message`, `result`, and `requirements` keys.

If a section is nested within another section, it is known as a “sub-section”.

A Section follows the following structure:

```yaml
Name:
  result: Rule
  requirements:
    <other sections / requirements>
```

## Requirements
A Requirement follows the following structure:

```yaml
Name:
  message: optional; a description of the requirement
  contract: optional; true|false; if true, the requirement is a contract between the student and the department
  department_audited: optional; true|false; if true, the requirement is tracked and audited by the department, not the registrar or SIS
  result: a Rule
  save: optional; an Array of Saved Subsets
```


# Rules

Rules are the basic building blocks of areas of study.

## course

A `course` rule states that a course must exist in the student’s plan. If the student’s plan includes the course listed, the rule will be **fulfilled**; otherwise, it will not.

> Most requirements should consist primarily of `course:` rules.

```yaml
course: CSCI 121
```

Most Rules support referring to `course` rules by way of a shorthand where you leave out the `course: ` prefix.

I.E., the following two rules are identical:

```yaml
count: any
of:
  - {course: CSCI 121}
```

```yaml
count: any
of:
  - CSCI 121
```

### Extra `course` properties

The verbose form of the `course` rule also supports additional keys, for certain scenarios:

- `term:` year-semester; specifies an exact term in which the course must have been taken; useful for topics courses
- `section:` letter; specifies the exact section for the course
- `year:` number
- `semester:` number
- `lab:` true|false
- `international:` true|false

A more verbose form of a course, then, looks like this:

```yaml
- {course: CSCI 121, section: A, lab: true, term: 2012}
```
## requirement

In order to refer to the result of a requirement, you must combine the key `requirement:` with the name of the requirement.

If you have

```yaml
requirements:
  Requirement Name:
    result: <blah>
```

then you can refer to the result of that requirement as follows:

```yaml
requirement: Requirement Name
```

You can also mark a requirement as "optional", which makes it completely optional.

To do so, add `optional: true` to the requirement:

```yaml
- {requirement: Requirement Name, optional: true}
```
## of/count

```yaml
count: Number | any | all
of: Array<Rule>
```

The `of` key takes an array of other Rules; `count` determines how many of the rules must evaluate to `true` in order for this rule to also evaluate to `true`.

The `of/count` rule is greedy; it does not end the evaluation process when the count is reached. Instead, it evaluates every possibility in the `of` array.

That is to say, `count: 1, of: [<four courses>]` will consume all four of those courses.

There is not currently a way to change this behavior. It remains to be seen if it is problematic.

### Examples

```yaml
count: all
of:
  - requirement: Requirement Name
  - course: CSCI 123
  - ASIAN 140
```

There are three valid values for the `count:` key: any positive, non-zero integer; the keyword “any”; or the keyword “all”.

## both/either

```yaml
both: [Rule, Rule]
```

```yaml
either: [Rule, Rule]
```

`both:` and `either:` are specializations of the `count:,of:` rule; you could write `both:` as `count:all,of:Rules`, and `either:` as `count:any,of:Rules`. Sometimes it’s just easier to be able to say “yeah, I want both of these things to be true”.

`both:` and `either:` both require exactly two Rules as their input.

TODO(hawken): do I need/want an `all:` / `any:` shorthand pair too? Maybe… it’s attractive.

### Examples
```yaml
either: [CSCI 121, CSCI 125]
```

```yaml
both: [CSCI 251, {course: CSCI 252, lab: true}]
```
## given
`given:` is the workhorse rule; when you need something that’s not feasible to describe statically, such as all of the FYW courses, `given:` is able to search through the student’s planned courses at audit time.

There are several variants of the `given:` rule, each of which are described below.

In general, a `given` rule takes a set of Inputs (`given:`), filters them through the given Filters (`where:`), selects the chosen type of Output for each item (`what:`), then executes the specific Action on said items (`do:`).

#### Examples

```yaml
# “There must be 6 or more courses with the `FYW` gereq attribute in the student's plan”
given: courses
where: {gereqs: FYW}
what: courses
do: count >= 6
```
### Types of Input
Each `given:` rule needs some type of input on which to execute. The `given:` key tells the rule what to execute on.

#### :courses
```yaml
given: courses
```

The `:courses` value will provide the set of all courses from the student’s plan.

#### :these courses
```yaml
given: these courses
courses: [CSCI 121, ASIAN 130]
repeats: first | last | all
```

The `:these courses` value requires that the `courses:` and `repeats:` keys be provided.

It provides the intersection between the student’s planned courses and the set of courses listed under `courses:`.

By specifying the `repeats:` key, you can control whether it will emit the first occurrence, the last occurrence, or all occurrences.

#### :these requirements
```yaml
given: these requirements
requirements: Array<RequirementName>
```

The `:these requirements` value requires that the `requirements:` key be provided.

It provides the set of courses which were used by the named requirements.

#### :areas of study
```yaml
given: areas of study
```

The `:areas of study` value provides the student’s areas of study – their degrees, majors, concentrations, and areas of emphasis.

#### :save
```yaml
given: save
save: "a named save block"
```

The `:save` value requires that the `save:` key be defined at the requirement level.

The `save: "a named save block"` value provides contents of that save block, as defined in the `save:` section of the current rule.

See the “Saving Subsets” section for more information.

### Types of Filters
A `given:` rule may need to filter the input data before it runs the action. The `where:` key tells the rule what data should be included or excluded.

The general syntax is as follows:

```yaml
where: {key: value, key2: value2}
```

where `key` may be one of “department”, “semester”, “year”, “level”, “institution”, “number”, “graded”, or “gereqs”.

`value` may be a simple value, like `MATH` or `FYW` or `2018` or `true`; it may be a keyword, like `graduation-year`; or it may be an operation, like `>= 2018` or `! MATH`.

#### where:{department}
```yaml
given: courses
where: {department: MATH}
```

```yaml
given: courses
where: {department: "! MATH"}
```

`where:{department}` filters the input down to only courses which have the given department.

> TODO(hawken): what happens to AS/PS? is the department AS/PS, ASIAN, PSCI, or [ASIAN, PSCI]?

#### where:{semester}
```yaml
given: courses
where: {semester: Interim}
```

`where:{semester}` filters the input down to only courses which were taken in the given semester.

Valid values are as follows: Fall, Interim, Spring, Summer Session 1, Summer Session 2.

#### where:{year}
```yaml
given: courses
where: {year: graduation-year}
```

`where:{year}` filters the input down to only courses which were taken in the given year.

Valid values are as follows: `graduation-year`.

#### where:{level}
```yaml
given: courses
where: {level: '>= 200'}
```

`where:{level}` filters the input down to only courses which were at the given level.

#### where:{institution}
```yaml
given: courses
where: {institution: St. Olaf College}
```

`where:{institution}` filters the input down to only courses which were taken at the given institution.

#### where:{graded}
```yaml
given: courses
where: {graded: true}
```

`where:{graded}` filters the input down to only courses which were taken graded (in other words, courses which were not p/n or s/u).

> TODO(hawken) er… yeah? what is a graded course? double-check.

#### where:{gereqs}
```yaml
given: courses
where: {gereqs: FYW}
```

`where:{gereqs}` filters the input down to only courses which have the given GE Requirement as an attribute.

In other words, given the filter `where: {gereqs: FYW}`, any course which has FYW in its gereqs attribute (i.e., `{gereqs: [FYW, WRI, HBS]`) will pass the filter.

#### where:{custom\_attribute}
These work similarly to the `where:{gereqs}` filter, but with some added wrinkles described in the “Custom Attributes on Courses” section.

```yaml
given: courses
where: {math_perspective: 'A'}
```

#### operators
Sometimes, you need to specify more than just a single value; to that end, you can specify either a less-than/greater-than operation or a boolean “or” as the value of a `where{thing}`.

##### or/and
```yaml
given: courses
where: {gereqs: 'MCD | MCG'}
```

##### less-than/greater-than
```yaml
given: courses
where: {level: '>= 200'}
```
#### Limiting Results

If you need to restrict a certain type of course from being counted, such as Asian Studies’ requirement that “no more than two level-I courses may count”, you can attach a “limiter” to the rule.

```yaml
given: courses
limit:
  - where: {level: 100}
    at_most: 2
do: count >= 6
```

For more information, see the “Limiters” section.

> TODO(hawken): Talk about how a limiter differs from a `where:` clause.
>
### Types of Output
Each `given:` rule must output some information. The `what:` key  tells the rule what to output.

#### what:courses
```yaml
given: courses
what: courses
```

This returns each course.

#### what:credits
```yaml
given: courses
what: credits
```

This returns the number of credits for each course.

#### what:distinct courses
```yaml
given: courses
what: distinct courses
```

> TODO(hawken): do we need “distinct” courses? I think I need to look at what makes it “distinct” again, because I have a feeling that the default type of a course might need to change, and we may need a “duplicated courses” value instead…

#### what:grades
```yaml
given: courses
what: grades
```

This returns the grade that the student got from each course.

#### what:terms
```yaml
given: courses
what: terms
```

This returns the term in which the course was taken for each course.

#### what:areas of study
```yaml
given: areas of study
what: areas of study
```

This returns each area of study.

### Types of Actions
Each `given:` rule needs to execute some type of action. The `do:` key tells the rule what to do.

#### commands
##### count
Given an input sequence of items, `count` becomes the number of items in the sequence.

```yaml
given: courses
what: courses
do: count >= 6
```

##### sum
Given an input sequence of _numbers_, `sum` becomes the sum total of the items in the sequence.

```yaml
given: courses
what: credits
do: sum >= 6
```

It’s important to highlight the difference between `what:credits, do:count` and `what:credits, do:sum`; `do:count` will return the number of courses _with credits_, while `do:sum` will tally them up and return the number _of credits_.

> todo(hawken): can we somehow merge `do:count` and `do:sum`? it’s never been confusing in hanson@v1…

##### average
Given an input sequence of _numbers_, `average` becomes the average of the items in the sequence.

```yaml
given: courses
what: grades
do: average >= 2.0
```

##### minimum
Given an input sequence of _numbers_, `minimum` becomes the smallest item in the sequence.

```yaml
given: courses
what: terms
do: minimum
```

This is mostly useful to save values for a later `$variable_name` action.

##### difference
Given a two-item input sequence of numbers, `difference` becomes the difference between the two items.

```yaml
given: these courses
courses: [DANCE 201, DANCE 212]
what: term
do: difference <= 1
```

##### $variable\_name
Writing `$variable_name` substitutes the calculated value of that variable into the equation.

```yaml
do: $first_btst < $first_ein
```

#### operators
##### less-than
The less-than operator, `<`, returns “true” if the left side is less than the right side; otherwise, it returns “false”.

It requires that both sides be numeric.

##### greater-than
The greater-than operator, `>`, returns “true” if the left side is greater than the right side; otherwise, it returns “false”.

It requires that both sides be numeric.

##### equal-to
The equal-to operator, `=`, returns “true” if the left side is equal to the right side; otherwise, it returns “false”.

It requires that both sides be numeric.

# Saving Subsets

You can "save" partial results for re-use later in the computation.

> Additionally, saving subsets can make the student's experience nicer, because it can display intermediate results of the computations.

A `save:` block may contain one or more `-save` rules.

A `-save` rule is similar to a `given:` rule, with a few differences:

- it requires a `name:` key
- the `do:` key is optional

```yaml
save:
  - given: courses
    where: {department: MATH}
    what: courses
    name: "The MATH Courses"
```

You can use any `-save` rule in any `given:` block at the same level, or it can serve as input to a subsequent `-save` rule.

# Examples

Save the AMCON or MATH courses, and assert that there are at least six of them.

```yaml
save:
  - given: courses
    where: {department: 'MATH | AMCON'}
    what: courses
    name: "either AMCON or MATH"
result:
  given: save
  save: "either AMCON or MATH"
  what: courses
  do: count >= 6
```

Assert that the student took their first WRI before their first BTS-T.

```yaml
save:
  - given: courses
    where: {gereqs: WRI}
    what: terms
    do: minimum
    name: "the first WRI"
  - given: courses
    where: {gereqs: BTS-T}
    what: terms
    do: minimum
    name: "the first BTS-T"
result:
  do: >
    "the first WRI" < "the first BTS-T"
```
# Limiters

Sometimes, a major needs to say "You may only count at most 2 non-MATH courses towards this major".

To do this, you can impose a "global limit", where the algorithm will stop using courses that match the given filters after the limit has been hit.

For instance, this block prevents more than two non-MATH courses from being selected to fulfill any requirement within the major.

```yaml
limiters:
  - where: {department: '! MATH'}
    at_most: 2
```

You may also place limiters within a `given` rule, as described in the “Limiting Results” section.

This rule prevents more than two level-I courses from being selected as part of the 6 courses needed to fulfill the requirement.

```yaml
given: courses
limit:
  - where: {level: 100}
    at_most: 2
do: count >= 6
```

A limiter can currently only apply an `at_most` limit; other modes may be added in the future, if needed.

# Custom Attributes on Courses

Sometimes, it's easier to specify courses by `where: {attribute: value}` as opposed to listing them individually in a the requirement.

To attach an attribute for courses within a major, you declare them at the top-level of the file:

```yaml
attributes:
  definitions:
    math_perspectives:
      type: set
      multiple values can be used: false
  courses:
    MATH 242: {math_perspectives: [M]}
    MATH 244: {math_perspectives: [C]}
    MATH 252: {math_perspectives: [A]}
    MATH 262: {math_perspectives: [C, D, M]}
    MATH 230: {math_perspectives: [C, M]}
    MATH 232: {math_perspectives: [D]}
```

That is, you declare a top-level dictionary called "attributes"; that contains two other dictionaries, named "definitions" and "courses".

The "definitions" dictionary is a set of key:value pairs, where each key defines the name of an attribute, and each value follows one of the following definitions.

## Attribute Types

### Set attributes

```yaml
type: set
multiple values can be used: true | false
```

The key `multiple values can be used` controls whether or not a course can count multiple times for its different attribute values.

If it's true, the attribute behaves like `gereqs`; if it has three values, the course can count for three different requirements, one per value, as well as one requirement which refers to the requirement directly.

If it's false, then no matter how many values there are, the course can count for only one requirement, as well as one other requirement which refers to the requirement directly.


### Other Attribute Types

There are currently no other allowed types of attribute.

## Example: Mathematics Perspectives

Sometimes, you need to use courses across two dimensions.

For example, the Mathematics major requires that you have courses in the "Transitions" requirement; then, it also has some courses that are "perspectives", and a course can be used both for a single perspective, and also for another requirement.

IE, MATH 220 is in the "A" perspective, and it's also in Transitions.

Normally, if you list the same course explicitly in two requirements, it can only be used by the first requirement.

To get around that, and allow a course to be used in two spots, you can specify custom attributes for a set of courses. Courses that are looked up by attribute are fetched in a separate pass, so they can count for multiple requirements.

You can mentally model these "custom attributes" like the normal gereqs attribute.  (Now, with that said, MATH's requirement actually differs from gereqs in one important way; a course can be counted for multiple GE requirements, but it may only count for one MATH perspective.)

# Messages

You can attach a `message:` to a requirement, section, or sub-section, in order to show a message to the student.

```yaml
requirements:
  Core:
    message: >
      A thing, with some description.
```
# Contracts

Certain requirements cannot be statically codified because they are defined individually per-student.

Currently, contracts are entered into by a student and a department, and they are stored and verified by the department.

To mark a requirement as a contract, you just add `contract: true` to the requirement.

```yaml
requirements:
  Core:
    message: A contract thing.
    contract: true
```
# Department Auditing

Certain requirements are tracked by the department, instead of the registrar.

To define a department-audited requirement, add the `department_audited` key to the requirement.

```yaml
requirements:
  Core:
    message: a message about the requirement
    department_audited: true
```
# Common Requirements among All Majors

TODO(hawken)

# Common Recipes

## Occurrences
Assert that the student has taken a given course more than once.

```yaml
result:
  given: these courses
  courses: [THEAT 233]
  what: courses
  do: count >= 1
```

## Dynamically selecting part of an “of”

If you need to filter or limit certain courses in an `of:` rule, I recommend switching to a `given:these courses` rule instead.

For example, you could do this to limit the student to only take one non-Philosophy course from the set of electives.

```yaml
given: these courses
courses: [PHIL 118, PHIL 119, PHIL 120, GCON 218, REL 147]
limit:
  - where: {department: '! PHIL'}
    at_most: 1
do: count >= 3
```
