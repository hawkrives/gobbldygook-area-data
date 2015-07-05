// # hanson.pegjs (take 8)

/*
- [ ] ensure that of-statements require commas between items
*/

/* example:
one of (
  CHEM 110 & 115,
  CSCI 121,
  three of (
    MATH 130,
    one course where {gereq == EIN & year <= max(year) from courses where {gereq = BTS-T}},
    two occurrences of THEAT130
  )
)
*/

{
  var globalLastDept
  function storeDept(dept) {
    globalLastDept = dept
  }
  function fetchDept(dept) {
    return globalLastDept
  }

  function expandDepartment(dept) {
    console.log(dept)
    if (dept === 'AR')
      return 'ART'
    else if (dept === 'AS')
      return 'ASIAN'
    else if (dept === 'ES')
      return 'ENVST'
    else
      return dept
  }
}

start
  = or

expr "expression"
  = _ e:(
      not
    / parenthetical
    / primitive
    / of
    / modifier
  ) _
  { return e }

primitive
  = _ p:(
      course
    / where
    / occurrence
    / requirement
  ) _
  { return p }


// Primitives

where
  = count:counter _ "course""s"? _ "where" _ where:qualifier
  { return {
      $type: 'where',
      $count: count,
      $where: where,
  } }

occurrence
  = count:counter _ "occurrence""s"? _ "of" _ course:course
    { return {
        $type: 'occurrence',
        $count: count,
        course,
    } }

// Primitive Components

qualifier
  = "{" _ q:or_q _ "}"
    { return q }

// only enable these if it's actually needed
// qualifier
//  = "{" _ q:(parenthetical_q / or_q)+ _ "}"
//    { return q }

// parenthetical_q
//  = "(" _ q:(or_q)+ _ ")"
//    { return q }

or_q "qualification-or"
  = lhs:and_q _ "|" _ rhs:or_q
    { return {
      $type: "boolean",
      $or: [lhs].concat('$or' in rhs ? rhs.$or : [rhs]),
    } }
  / and_q

and_q "qualification-and"
  = lhs:qualification _ "&" _ rhs:and_q
    { return {
      $type: "boolean",
      $and: [lhs].concat('$and' in rhs ? rhs.$and : [rhs]),
    } }
  / qualification

qualification
  = key:word _
    op:operator _
    value:(
        word:[a-z0-9_\-]i+ !("(")
         { return word.join("") }
      / f:func _ "from" _ "courses" _ "where" _ q:qualifier
         { return Object.assign(f, {$where: q}) }
    )
    { return {
        $type: "qualification",
        $key: key,
        $value: { [op]: value, $type: "operator" },
    } }

word
  = chars:[a-z]i+
    { return chars.join("") }

func "function"
  = name:word _ "(" _ prop:word _ ")"
    { return {
      $name: name,
      $prop: prop,
      $type: "function",
    } }

operator
  = ("<=")       { return "$lte" }
  / ("<")        { return "$lt"  }
  / ("==" / "=") { return "$eq"  }
  / (">=")       { return "$gte" }
  / (">")        { return "$lt"  }
  / ("!=")       { return "$ne"  }

_ "whitespace"
  = [ \n\t\r]*

counter
  = english_integer
  / numeric_integer

english_integer
  = "zero"  { return 0 }
  / "one"   { return 1 }
  / "two"   { return 2 }
  / "three" { return 3 }
  / "four"  { return 4 }
  / "five"  { return 5 }
  / "six"   { return 6 }
  / "seven" { return 7 }
  / "eight" { return 8 }
  / "nine"  { return 9 }
  / "ten"   { return 10 }
  / "eleven"    { return 11 }
  / "twelve"    { return 12 }
  / "thirteen"  { return 13 }
  / "fourteen"  { return 14 }
  / "fifteen"   { return 15 }
  / "sixteen"   { return 16 }
  / "seventeen" { return 17 }
  / "eighteen"  { return 18 }
  / "nineteen"  { return 19 }
  / "twenty"    { return 20 }

numeric_integer
  = num:[0-9]+
    { return parseInt(num.join(""), 10) }


// Expressions

not
  = "!" _ value:expr
    { return {
      $type: 'boolean',
      $not: value
    } }

parenthetical
  = "(" _ value:start _ ")"
    { return value }

or
  = lhs:and _ "|" _ rhs:or
    { return {
      $type: 'boolean',
      $or: [lhs].concat('$or' in rhs ? rhs.$or : [rhs]),
    } }
  / and

and
  = lhs:expr _ "&" _ rhs:and
    { return {
      $type: 'boolean',
      $and: [lhs].concat('$and' in rhs ? rhs.$and : [rhs]),
    } }
  / expr

of
  = count:(counter / "all" / "none" { return 0 } / "any" { return 1 }) _ "of" _ "(" _ of:(
      val:start
      rest:( _ "," _ second:start { return second } )* ","?
      { return [val].concat(rest) }
    )+ _ ")"
    {
      var flattened = Array.prototype.concat.apply([], of)

      if (count === "all")
        count = flattened.length

      if (count && flattened.length < count)
        throw new Error(`this of-statement will never succeed; you requested ${count} items, but only input ${flattened.length} options (${JSON.stringify(flattened)}).`)

      return {
        $type: 'of',
        $count: count,
        $of: flattened,
      }
    }

modifier
  = count:counter _
    what:(
        "course"
      / "credit"
      / "department" & ("from" _ "children")
    ) "s"? _ "from" _ from:(
        "children" { return { $from: "children"}}
      / "courses" _ "where" _ where:qualifier { return {$from: "where", $where: where} }
    )
    { return Object.assign({
        $type: 'modifier',
        $count: count,
        $what: what,
    }, from) }


// Course

course
  = dept:c_dept? _
    num:c_num
    info:("." section:c_sect
      y_s:("." year:c_year
        sem:("." semester:c_sem
          { return {semester} } )?
        { return Object.assign(sem || {}, {year}) } )?
      { return Object.assign(y_s || {}, {section}) } )?
    { return Object.assign({$type: 'course'},
        Object.assign(info || {},
        Object.assign(dept || fetchDept() || {}, num))) }

c_dept
  = dept1:(c1:[A-Z] c2:[A-Z] { return c1 + c2 })
    part2:(
        chars:[A-Z]+ { return {dept: chars.join(''), type: "joined"} }
      / "/" l1:[A-Z] l2:[A-Z] { return {dept: l1 + l2, type: "seperate"} }
    )
    {
      var {type, dept: dept2} = part2
      var department
      if (type === "joined")
        department = {department: [dept1 + dept2]}
      else if (type === "seperate") {
        dept1 = expandDepartment(dept1)
        dept2 = expandDepartment(dept2)
        department = {department: [dept1, dept2]}
      }
      storeDept(department)
      return department
    }

c_num "course number"
  = p1:[0-9]
    p2:(n2:[0-9] n3:[0-9] {return n2 + n3} / "XX")
    international:"I"?
    _ lab:"L"?
    {
      var number = undefined
      var level = undefined

      var result = {}
      if (p2 === "XX") {
        result.level = parseInt(p1) * 100
      }
      else {
        result.number = parseInt(p1 + p2)
      }

      if (international)
        result.international = true
      if (lab)
        result.lab = true

      return result
    }

c_sect
  = [A-Z*]

c_year
  = nums:([0-9][0-9][0-9][0-9])
    { return nums.join("") }
  / "*"

c_sem
  = [1-5*]

requirement
  = title:(initial:[A-Z0-9] rest:[0-9a-z\- ]i+
      { return initial + rest.join("") } )
    { return {
      $type: 'requirement',
      $requirement: title.trim()
    } }
