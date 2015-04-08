# `sto-areas` changelog

## 2.3.12
- fix import in commonGraduationUtilities

## 2.3.11
- Fix imports
	- `import x from 'y'` imports the 'default' export from y.
	- `import * as x from 'y'` imports all of the named exports from y.

## 2.3.9
- Stopped pinning package versions in package.json

## 2.0.* - 2.3.8
- Who knows.

## 2.0.4
- Removed demo_student.json
- Added export of all areas in an array from index.js for easy querying

## 2.0.3
- Added fake years to d-ba, m-asian, and a few others.

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
