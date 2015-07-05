
---

start
  = additive

additive
  = left:multiplicative "+" right:additive { return left + '+' + right; }
  / multiplicative

multiplicative
  = left:primary "*" right:multiplicative { return left + '*' + right; }
  / primary

primary
  = integer
  / "(" additive:additive ")" { return additive; }

integer "integer"
  = ws? digits:[0-9]+ ws? { return digits.join(""); }

ws
  = [ \t\n\r]

---

start
  = course

course "course"
  = name:courseName
    props("(" ws* props:courseProps ws* ")" { return props })?
    { return {name: name, props: props} }

courseProps "course props"
  = prop:courseProp
    props:(ws* "," ws* prop:courseProp { return prop })*
      { return [prop].concat(props) }

courseProp "course prop"
  = name:propName
    type:(ws* ":" ws* type:propType { return type })?
    { return {name: name, type: type} }

courseName "course name"
  = first:[A-Z_$] rest:[a-z0–9_$]i* { return first + rest.join(‘’) }

propName "prop name"
  = first:[a-z_$]i rest:[a-z0–9_$]i* { return first + rest.join(‘’) }

propType "prop type"
  = first:[a-z_$]i rest:[a-z0–9_$]i* { return first + rest.join(‘’) }

ws "whitespace"
  = [ \t\r\n]
