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
    if (dept === 'AR')
      return 'ART'
    else if (dept === 'AS')
      return 'ASIAN'
    else if (dept === 'ES')
      return 'ENVST'
    else
      return dept
  }

  function flatten(list) {
    return Array.prototype.concat.apply([], list)
  }

  Object.assign = Object.assign || require('lodash').extend
}

start
  = or

expr 'expression'
  = _ e:(
      not
    / parenthetical
    / course
    / where
    / occurrence
    / reference
    / of
    / modifier
  ) _
  { return e }


// Primitives

where
  = count:counter _ 'course''s'? _ 'where' _ where:qualifier
  { return {
      $type: 'where',
      $count: count,
      $where: where,
  } }

occurrence
  = count:counter _ 'occurrence''s'? _ 'of' _ course:course
    { return {
        $type: 'occurrence',
        $count: count,
        course,
    } }

// Primitive Components

qualifier
  = '{' _ q:or_q _ '}'
    { return q }

// only enable these if it's actually needed
// qualifier
//  = '{' _ q:(parenthetical_q / or_q)+ _ '}'
//    { return q }

// parenthetical_q
//  = open_paren _ q:(or_q)+ _ close_paren
//    { return q }

or_q 'qualification-or'
  = lhs:and_q _ '|' _ rhs:or_q
    { return {
      $type: 'boolean',
      $or: [lhs].concat('$or' in rhs ? rhs.$or : [rhs]),
    } }
  / and_q

and_q 'qualification-and'
  = lhs:qualification _ '&' _ rhs:and_q
    { return {
      $type: 'boolean',
      $and: [lhs].concat('$and' in rhs ? rhs.$and : [rhs]),
    } }
  / qualification

qualification
  = key:word _
    op:operator _
    value:(
        word:[a-z0-9_\-]i+ !(open_paren)
         { return word.join('') }
      / f:func _ 'from' _ 'courses' _ 'where' _ q:qualifier
         { return Object.assign(f, {$where: q}) }
    )
    { return {
        $type: 'qualification',
        $key: key,
        $value: { [op]: value, $type: 'operator' },
    } }


func 'function'
  = name:word _ open_paren _ prop:word _ close_paren
    { return {
      $name: name,
      $prop: prop,
      $type: 'function',
    } }

operator
  = ('<=')       { return '$lte' }
  / ('<')        { return '$lt'  }
  / ('==' / '=') { return '$eq'  }
  / ('>=')       { return '$gte' }
  / ('>')        { return '$lt'  }
  / ('!=')       { return '$ne'  }

_ 'whitespace'
  = [ \n\t\r]*

counter
  = english_integer
  / numeric_integer

english_integer
  = 'zero'  { return 0 }
  / 'one'   { return 1 }
  / 'two'   { return 2 }
  / 'three' { return 3 }
  / 'four'  { return 4 }
  / 'five'  { return 5 }
  / 'six'   { return 6 }
  / 'seven' { return 7 }
  / 'eight' { return 8 }
  / 'nine'  { return 9 }
  / 'ten'   { return 10 }
  / 'eleven'    { return 11 }
  / 'twelve'    { return 12 }
  / 'thirteen'  { return 13 }
  / 'fourteen'  { return 14 }
  / 'fifteen'   { return 15 }
  / 'sixteen'   { return 16 }
  / 'seventeen' { return 17 }
  / 'eighteen'  { return 18 }
  / 'nineteen'  { return 19 }
  / 'twenty'    { return 20 }



// Expressions

not
  = '!' _ value:expr
    { return {
      $type: 'boolean',
      $not: value
    } }

parenthetical
  = open_paren _ value:start _ close_paren
    { return value }

or
  = lhs:and _ '|' _ rhs:or
    { return {
      $type: 'boolean',
      $or: [lhs].concat('$or' in rhs ? rhs.$or : [rhs]),
    } }
  / and

and
  = lhs:expr _ '&' _ rhs:and
    { return {
      $type: 'boolean',
      $and: [lhs].concat('$and' in rhs ? rhs.$and : [rhs]),
    } }
  / expr

of
  = count:(
        counter
      / 'all'
      / 'any' { return 1 }
      / 'none' { return 0 }
    )
    _ 'of' _ open_paren _
    of:(
      val:start
      rest:( _ ',' _ second:start { return second } )* ','?
      { return [val].concat(rest) }
    )+ _ close_paren
    {
      var flattened = flatten(of)

      if (count === 'all')
        count = flattened.length

      if (count && flattened.length < count)
        throw new Error(`this of-statement will never succeed; you requested ${count} items, but only listed ${flattened.length} options (${JSON.stringify(flattened)}).`)

      return {
        $type: 'of',
        $count: count,
        $of: flattened,
      }
    }

modifier
  = count:counter _
    what:(
        'course'
      / 'credit'
      / 'department' & ('from' _ 'children')
    ) 's'? _ 'from' _
    from:(
        'children' { return { $from: 'children' }}
      / 'filter' { return { $from: 'filter' }}
      / 'courses' _ 'where' _ where:qualifier { return {$from: 'where', $where: where} }
    )
    { return Object.assign({
        $type: 'modifier',
        $count: count,
        $what: what,
    }, from) }


reference 'requirement reference'
  = title:(
      initial:[A-Z0-9]
      rest:[A-Z0-9\- ]i*
      { return initial + rest.join('') } )
    { return {
      $type: 'reference',
      $requirement: title.trim()
    } }


// Course

dot 'a single period'
  = '.'

course
  = dept:c_dept? _
    num:c_num
    details:(
      dot section:c_sect sub:(
        dot year:c_year sub:(
          dot semester:c_sem { return {semester} }
        )? { return Object.assign({year}, sub) }
      )? { return Object.assign({section}, sub) }
    )?
  {
    return Object.assign(
      {$type: 'course'},
      details || {},
      dept || fetchDept() || {},
      num)
  }

c_dept
  = dept1:(c1:uppercase_letter c2:uppercase_letter { return c1 + c2 })
    part2:(
        chars:uppercase_letter+
          { return {dept: chars.join(''), type: 'joined'} }
      / '/' l1:uppercase_letter l2:uppercase_letter
          { return {dept: l1 + l2, type: 'seperate'} }
    )
    {
      let {type, dept: dept2} = part2
      let department
      if (type === 'joined') {
        department = {department: [dept1 + dept2]}
      }
      else if (type === 'seperate') {
        department = {department: [
          expandDepartment(dept1),
          expandDepartment(dept2)
        ]}
      }
      storeDept(department)
      return department
    }

c_num 'course number'
  = num:(
        nums:(digit digit digit)
          { return {number: parseInt(nums.join(''))} }
      / num:digit 'XX'
          { return {level: digit * 100} }
    )
    international:'I'? _ lab:'L'?
    {
      let result = {}

      if (international) {
        result.international = true
      }
      if (lab) {
        result.lab = true
      }

      return Object.assign(result, num)
    }

c_sect
  = uppercase_letter
  / '*'

c_year
  = nums:(digit digit digit digit)
    { return parseInt(nums.join('')) }
  / '*'

c_sem
  = num:[1-5] { return parseInt(num) }
  / '*'

// Primitives

uppercase_letter
  = char:[A-Z]
    { return char }

word
  = chars:[a-z]i+
    { return chars.join('') }

numeric_integer
  = num:digit+
    { return parseInt(num.join('')) }

digit
  = num:[0-9]
    { return parseInt(num) }

open_paren
  = '('

close_paren
  = ')'
