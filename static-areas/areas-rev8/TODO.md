Evaluator:

In order to support the "n thing from children" modifier, 'all' that needs to
be done is to keep track of the courses used in successful blocks and stick
them somewhere that the modifier can find them. Maybe on a "_matches" prop?

- "where" does this already.
- "course" will just need to be tracked from the parent level
- "of" and "boolean" will be modified to read the "_matches" prop
- "occurrence" will just use either the thing it's looking for, or None,
    depending on the success of the search.
- That should be it, I think.


Full Support of 12 Areas:
- in peg
  - "filter" key
  - "declare" key (for variables)
  - parentheses in "where" qualifiers
- in evaluate
  - "n things from children"
  - parens in "where" qualifiers
