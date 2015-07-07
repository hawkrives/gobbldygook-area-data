# gobbldygook-area-data

This repository contains both the source data for the various St. Olaf areas of study (degrees, majors, concentrations, and emphases) and a collection of tools for working with said data.

Each area of study begins life as a file in the so-called "hanson format"[^1]. The hanson format is human-readable (and -writable) file that specifies the requirements needed to successfully complete that area of study.

^1: so named for Professor Hanson, (Chemistry), who advised Gobbldygook in January 2015. He came up with a basic format, which we later expanded on.

This format is detailed [below](#hanson-format-details).

## Enough with the words! I want to {improve, edit, break} something!
Alrighty! Fire up a terminal, get yourself a copy of this repository ("git clone https://github.com/hawkrives/gobbldygook-area-data.git"), then open 'er up and "npm install". (npm kindly takes care of various things for us, including dependencies and scripts.) 

## Hanson Format Details
Each area of study **MUST** include at least four keys:

- **name** (the name of the area of study; "Computer Science" or "Asian Studies")
- **revision** (the school year in which the area was last revised; 2012-13 or 2015-16)
- **type** (one of "degree", "major", "concentration", or "emphasis"; case doesn't matter)
- **result**

These keys **MUST** be lower-case.

Each key **MUST** be followed by a colon. The colon delimits a key and its value.

The "result" key is special. It's made up of one or more requirements, defined elsewhere in the file, which are used to determine the final graduatability of a student.

### What's in a requirement?
Every requirement is comprised of a name, zero or more child requirements, and a result.

A requirement name **MUST** begin with either an uppercase letter or number. It **MAY** include upper-and-lower-case letters, numbers, spaces, underscores, and hyphens. It **MUST** be at least one character long.

A child requirement is simply another requirement. 

Any keys—child requirements, "filter", or "result"—**MUST** be indented past the parent key's indentation. Indentation **MUST** be done with spaces, not tabs.

### Alright, so what is a result?
A "result" is the special sauce of the hanson format. 

It can be as simple as a single course—CHEM 121—or as complex as, well, as complex as it needs to be.

A result is composed of one or more statements:

- course
- number of occurrences of a course
- of-expression
- where-clause
- reference to a child requirement
- any permutation of the above, separated by boolean operators

**course:** CSCI 121; AS/ES 250; CH/BI 121<br>
A course is, in its simplest form, a department-number pair.<br>
It can be extended to specify a required section, year, and/or semester (CHEM 121.A.2014.5). That is to say, DEPARTMENT [space] NUMBER [period] A-Z or \* [period] FOUR-DIGIT YEAR or \* [period] 1-5 or \*.<br>
The stars signify a wildcard, because in order to specify, let's say, a course that must have been taken in the spring (CHEM 121.\*.\*.3), you **MUST** include all of the previous data.<br>
A "course" is used to ensure that a student has taken a course. It should be specified as loosely as possible.

**reference:** "Electives"<br>
The name of a child requirement.

**occurrence:** "two occurrences of CHEM 121"<br>
ENGLISH NUMBER occurrence(s) of COURSE<br>
COURSE may be any variation of a course, as specified above.<br>
An "occurrence" is used to ensure that a course has been taken multiple times. For example, the Theatre major uses it to ensure that students have taken the practicum course twice.

**of:** "one of (CSCI 121, CHEM 125)"<br>
ENGLISH NUMBER of (STATEMENT [, STATEMENT])<br>
STATEMENT must be one of the various types of statement. You may include more than one statement within the parentheses; each statement must be separated by commas.<br>
An "of-expression" is generally used to allow students to choose from several of a large number of courses. For example, the Studio Art major uses it to require that students have taken 8 out of 28 courses.

**where:** "one course where { gereqs = FYW }"<br>
ENGLISH NUMBER course(s) where { property OPERATOR value [&,| key = value] }<br>
OPERATOR must be one of "=" (or "=="), "<", "<=", ">=", or ">". (equals, less-than, less-than-or-equal-to, greater-than-or-equal-to, or greater-than)<br>
Property must be a lower-case string (no digits). Valid options are "…".
Value may be one of two possibilities: it can be a scalar value (string or number; may include hyphens and underscores), or it can be a nested where-clause.<br>
A "where-clause" filters the list of courses taken by a student by checking each course for the specified property, and comparing it to the given value. (If the property is a list, then we check for the existence of the value in the list.) Each property/operator/value set is known as a "qualifier". More complex filters can be created by separating qualifiers by "&" or "|", and/or nesting them within parentheses.<br>
The value can also be computed as the result of another where-clause. Yep. That's right. "one course where { gereqs = EIN & year <= max(year) from courses where { gereqs = BTS-T } }" is a valid where-clause. The nested where-clause is used to filter the student's list of courses, from which we extract the specified property, then return either the maximum or minimum value of the resulting list. That value is then used to compute the containing clause.

**booleans:** "CSCI 121 | CHEM 125"<br>
STATEMENT [&,| STATEMENT]<br>
!STATEMENT<br>
Any two statements may be separated by a single ampersand "&" to indicate that they must both be true, or a single pipe "|" to indicate that either one may be true. (You may also prefix a statement with an exclamation point "!" to invert the result.)<br>
You may also use parentheses to override the boolean logic. "A | B & C" is equivalent to "A | (B & C)", but you can force it to be "(A | B) & C" with parentheses.

**modifiers:** "one credit from courses where {}" or "two departments from children"<br>
ENGLISH NUMBER [credit | department | course] from [courses where | children | filter]




## JSON Format Details
