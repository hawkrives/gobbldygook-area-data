# gobbldygook-area-data

<div>
    <a href='https://travis-ci.org/hawkrives/gobbldygook-area-data'><img src='https://travis-ci.org/hawkrives/gobbldygook-area-data.svg?branch=master' alt='Build and Test Status' /></a>
    <a href='https://coveralls.io/github/hawkrives/gobbldygook-area-data?branch=master'><img src='https://coveralls.io/repos/hawkrives/gobbldygook-area-data/badge.svg?branch=master&service=github' alt='Code Coverage Status' /></a>
</div>


## Details of the Hanson format

What we call the "Hanson format" is named after Professor Bob Hanson, who provided the original inspiration for this style of declarative area-of-study specification.

An area of study is a degree, major, concentration, or area of emphasis. In this document, unless otherwise specified, the phrases "major" and "area of study" are synonymous.

Each major file must be a valid YAML file. That is, it will be a set of nested `key: value` pairs, where the end of the key is signified by a colon. YAML files must be intended with spaces, not tab characters.

The top level of a major file looks something like this:

```yaml
name: Major Name
type: major
revision: 2015-16
result: Requirement A & Requirement B

Requirement A: ART 102 & 103

Requirement B:
    result: CSCI 121 | 125 | 320
```

In the most basic sense, an area of study file is a list of requirements, where each requirement is composed of the courses that you must take to complete the requirement.

Each requirement must include either a `result` key, or a `message` key. (These key names are case-sensitive.) If no keys exist under a requirement, the value is parsed as a course expression, and implicitly assigned to `result`.

If a `message` key is provided, the message is rendered with markdown and displayed before the result. If only a message key is provided. It is rendered and shown with a button for easy acquiescence (to the demands of the message.)

The values of the `result` and `message` keys are interpreted as strings. In order to remain readable, we recommend splitting the contents of the string over multiple lines once it gets long. The string may be split by any number of line breaks, as long as the first non-whitespace character on the line is indented past the first character of the key.

```yaml
Requirement:
    message:
        You may include messages here.
        They can be broken across multiple lines.
```

`result`s are comprised of a mixture of course expressions and requirement references.


## Course Expressions

A course expression is a powerful construct. It can be as simple as "the user must have taken Computer Science 111," or as complex as "one course with both the EIN general education requirement *and* taken in a year before (or in the same year as) the highest year from courses with the BTS-T general education requirement," or anything in-between.

The most basic course expression is a single course. A single course is specified, at the simplest level, by the department abbreviation, a space, then the course number, like CSCI 115 or AS/RE 150. If you use a dual-department course, it must use the short abbreviations of the departments—AS instead of ASIAN, AR instead of ART—separated by a forward-slash "/".

When you have several course expressions in a row that share the same department, you can leave off subsequent department declarations; each course between two department declarations will be assigned the last seen department from that result key.

These course expressions may be joined into a Boolean expression by way of the "and" (`&`, the ampersand) and/or "or" (`|`, the pipe character).

The parts of a Boolean expression are evaluated as arguments to the operators. "A | B" returns true if either A or B is true, while "A & B" requires both to be true. Each individual course expression is evaluated to either true or false. This means that a Boolean expression such as "(CSCI 125 | 121) & 251 & 252" will be fulfilled if the student has taken either CS 125 or 121, and CS 251, and CS 252.

The order of operations is as you might expect: parentheses win, followed by "and," and finally "or."

The system tracks which courses have been taken at the least specific level possible: department + number. The same course will not count for more than one requirement. (Section, year, semester, lab, and international qualifiers are stripped off for this comparison.)

If you have a bunch of courses that students can take, it would be much too hard to write out all possible combinations of the courses. Imagine that you have three courses—A, B, and C—and the student may take any two of them. A Boolean equivalent might look like "A & B | B & C | A & C"—that's already pretty long; imagine how long it would get with, say, 3 courses from 10 options.

That's why we support "of-expressions." `two of ( CSCI 121, 125, ART 102, 103, 104 )`—the student must take two of the courses listed in the parentheses.

of-expressions may contain any of the expressions detailed here. "three of (CSCI 121 & 125, 241, 251 & 252)" is valid.

The number at the beginning of the of-expression may be any number between "zero" and "twenty," or one of the words "all," "any," or "none."  "none" equates to "zero"—that is, the student must have taken zero of the courses listed to pass the expression. "any" equates to "one," and "all" is evaluated to be the number of items within the of-expression.

If you require the student to take more items that you list—say, "three of (CSCI 121, 251)"—the program will warn you that the requirement can never be completed.

Those three types of expressions cover most of the needs of expressing major requirements.


## Child Requirements

Each requirement may be as simple as a "result" string. However, it may also be composed from the results of one or more child requirements.

Each requirement may include any number of child requirements. A requirement name must begin with either a capital letter or a number, and may contain any number of additional letters, numbers, underscores, and hyphens.

```yaml
Requirement:
    result: Child Requirement 1 | Child Requirement 2

    Child Requirement 1: CSCI 121
    Child Requirement 2: CSCI 251
```

If you include child requirements, you must explicitly name and specify the result of the host requirement.

Both boolean expressions and of-expressions support requirement references anywhere they support courses.

The Boolean equivalent of a requirement reference is the boolean value of the result of the referenced requirement.

You can only reference an immediate child requirement.

```yaml
Parent:
    result: Grandchild
    Child:
        Grandchild: CSCI 121
```

The above will not work. Parent cannot see the children of Child. Instead, give Child a `result` of "Grandchild," and Parent a `result` of "Child".

```yaml
Parent:
    result: Child
    Child:
        result: Grandchild
        Grandchild: CSCI 121
```

<--For some reason, we support abbreviating requirement names. If you end a requirement with a phrase in parentheses, it will be treated as an abbreviation of the full requirement name, and can be used anywhere the full name can. Additionally, you may refer to a requirement with an abbreviation by the name without the abbreviation, or by the entire string—including parentheses.-->

-----

When you need more power, you may reach for where-expressions, modifiers, and filters. Please, though, try and only use these in a last resort; most majors can be expressed with only courses, boolean- and of-expressions, and requirement references.

### where-expressions

A where-expression is composed of two parts, a counter and a qualifier. The counter is the same as in an of-expression; an English number between zero and twenty. A qualifier is made up of one or more qualifications, surrounded by curly braces.

A qualification is a key/value pair representing a property/value pair to look for. Qualifiers operate on a list of courses, filtering the list to only those courses which qualify.

Qualifications may be separated by the boolean operators "and" (&) and/or "or" (|). They may be grouped by parentheses. Normal Boolean logic applies.

A set of and-separated qualifications will return the set of courses which matched all of the provided qualifications. A set of or-separated qualifications will return the set of courses which matched any of the provided qualifications.

The key/value pair must be separated by an operator; valid operators are "=", "<", "<=", ">", and ">=". The logic of all operators other than "equals" on values other than numbers is not defined.

An example where-expression would be `one course where { gereqs = FYW }`. It will look for one course whose `gereqs` property is FYW. If the property in question is a list of values, as in the case of `gereqs`, it will check to see if the list contains the specified value.

The list of valid properties is: year, semester; department, number, section, lab, international; clbid, crsid; credits; (and possibly more. It's just a plain `pluck()`function.)

In extreme cases, the value may be expressed as the result of a function run over another list of courses. So far, the only area of study that requires this amount of power are the degrees.

This looks like `{ year <= max(year) from courses where { gereqs = BTS-T } }`

The value, in this case, is the name of a function to run on the values of the specified property from the list of courses which match the nested qualification. (TODO: make clearer.)


### The `filter` key

Requirements may have another key, beyond just `result` and `message`. The `filter` key is a where-expression that filters the list of possible courses before it reaches the result.

```yaml
filter: only courses where { gereqs = FYW }
```

Now the `result` will only be able to see courses that passed the filter.


### modifiers

Modifiers primarily exist to count things. They can count things from four different sources: *all* child requirements ("from children"), *some* child requirements ("from (Child, Child 2)"), the `filter` key ("from filter"), or from a new where-expression ("from courses where {}").

Modifiers can count three things from a source: the number of unique courses taken (not classes), the number of credits earned, and the number of unique departments.

These concepts are expressed like `<count> <thing> from <source>`. `count` may be an English number between zero and twenty.


## Defining an Area of Study

Let's back up a bit, back to the top level of the major file.

The top level must have at least four keys: `name`, `type`, `revision`, and `result`.

Name is the name of the area of study.

Type must be one of "degree," "major," "concentration," or "emphasis." They are not case-sensitive.

Revision is the school year during which the area was last modified; "2012-13" or "2015-16". It must include the year of the fall semester and the year of the spring semester.

Result is just like any other result key: a combination of requirement references and course expressions. It is unique, though, in that it will likely not include any course expressions itself, instead only referencing child requirements.

-----

I think that's all of the concepts!


## Formatting

I have a preferred formatting of things. It changes.

- Please indent each level by four spaces
- Try to limit the file to 80~ characters wide
- When of-expressions have, like, a bunch of options, put:
    - line-breaks before each change in department
    - a maximum of five courses on each line
    - subsequent lines of courses in the same department should be indented one space past the department name
    - a line break after the opening parenthesis
    - the closing parenthesis on the same line as the last course

-----

## A History of the Hanson Format
### v1
### v2
### v3
### v4
### v4.1
### v4.2
### v4.3
### v4.4
### v4.5
