/*
 * Classic example grammar, which recognizes simple arithmetic expressions like
 * "2*(3+4)". The parser generated from this grammar then computes their value.
 */

start
  = list

ws
  = " "?

reqname
  = name:( [A-Z][a-z ]+ abbr:(" ("[A-Z]+")")? )
    { return {name: name, abbr: abbr || ''} }

course
  =
    (department:([A-Z]))//{2, 5}(/[A-Z]{2})?)?) (ws)
    (number:(integer))//((integer) ((integer) / "X"){2} international:("I")?))
    //(info:
      //"."section:([A-Z*])
      //(
        //"."year:(\d{4} / "*")
        //(
          //"."semester:([1-5*])
        //)?
      //)?
    //)?
    {
      return {
        department: department,
        number: number,
        international: international,
        info: info,
        section: section,
        year: year,
        semester: semester,
      }
    }

counter
  = counter:(
      (eng_num) ' ' (
        (('course' / 'credit' / 'department')('s'?)) /
        ('occurrence'('s'?) ' of ' (course))
      )
    )
  { return counter }

expression
  = expr:(reqname / course / counter / of / where)
    { return expr }

list
  = "("? (ws) contents:(expression / ws / comma / operator)+ (ws) ")"?
    { return contents }

of
  = " of (" contents:(.+) ")"
    { return [contents] }

comma
  = ","

operator
  = token:("!" / "&" / "|")
  {
    if (token === '!')
      return '$ne'
    else if (token === '&')
      return '$and'
    else if (token === '|')
      return '$or'
  }

boolean
  = token:("<=" / "<" / ">" / ">=" / "=" / "!=")
  {
    if (token === "=")
      return "$eq"
    else if (token === "<=")
      return "$lte"
    else if (token === "<")
      return "$lt"
    else if (token === ">=")
      return "$gte"
    else if (token === ">")
      return "$gt"
    else if (token === "!=")
      return "$ne"
  }

// {abc: {$eq: 12345}}

eng_num
  =
    num:(
      'zero'/'one'/'two'/'three'/'four'/'five'/'six'/'seven'/'eight'/'nine'/
      'ten'/'eleven'/'twelve'/'thirteen'/'fourteen'/'fifteen'/'sixteen'/'seventeen'/'eighteen'/'nineteen'/
      'all'/'any'/'none')

    {
      if (num === 'zero' || num === 'none')
        return 0
      else if (num === 'one')
        return 1
      else if (num === 'two')
        return 2
      // ...
      else if (num === 'all')
        return Infinity // or do we want a special variable?
      else if (num === 'any')
        return 1
    }

integer "integer"
  = digits:[0-9]+ { return parseInt(digits.join(""), 10); }

char "character"
  = alphabet:[a-z]i+ { return alphabet.join('') }

where
  = (counter) (' from course' ('s'?))? ' where '
    '{' (ws) key:([a-z]+) (ws) boolean:boolean (ws) value:(.+ / where) (ws) '}'
    { var obj = {}; obj[key] = {}; obj[key][boolean] = value; return obj; }
