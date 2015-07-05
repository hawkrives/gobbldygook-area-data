This current version is very much broken up between several parts. 

Eventually, the Hanson file will go in, and a JSON file will come out; then `evaluate` will take the JSON, a list of courses, and a map of overrides, and return a mutated ("enhanced") object with enough info (hopefully) to render the sidebar info pane. 

Currently, though, the glue between the PEGjs parser and the file reader isn't written, so it has to be done manually. 

Each "result" string must be fed into the peg, then copied back into the Hanson file. The Hanson file also needs to have types assigned to the requirements themselves, and enough braces put in that it becomes valid JSON. 

Might be easiest to use the online JS-yaml tool at <http://nodeca.github.io/js-yaml>, then copy each result string into the online PEGjs parser at <http://pegjs.org/online>, then copy it back to replace the result string with the result object. 

Lots o' work, right now. Yeppers. 

---

Eventual workflow:
## Parsing

### CLI:
```
hanson-to-json [filename] [-o filename]

If filename is not given, it will read from stdin. 

if -o is not given, it will write to stdout. 
```

### Programmatic
Hanson exposes a `parse` method that takes one argument, a string of yaml-formatted data.

Returns a JS object. 

## Evaluating
### CLI
Takes two arguments, a student file and a major file. 

### Programmatic
Exposes an `evaluate` function with two arguments; `student` and `area`.

(I think, anyway. I just realized that I think the BA degree needs access to the student data… well, we'll see.)
