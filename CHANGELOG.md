# `sto-areas` changelog


## 2.0.2

- Move cleaning up into a `postpublish` task


## 2.0.1

- Uh, switch away from Browserify
- Update sto-helpers
- Only publish the compiled stuff to npm


## 2.0.0

- Switch to Browserify
- Add CHANGELOG
- Hope that Browserify will automatically transform packages when required
- **Change:** Areas now expect a `studentData` argument, instead of a `student` argument with a `data()` method. This should allow easier reuse.
