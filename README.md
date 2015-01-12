# README

sto-areas is the home of the area of study data for Gobbldygook. As such, while this README would normally document whatever steps are necessary to get your application up and running, you don't need to do anything unless you want to edit the data.


### How do I get set up? ###

- Clone: `git clone https://github.com/hawkrives/gobbldygook-area-data.git`
- Edit: If you want to update a file, update it, then send a pull request.

### To Publish on NPM
- After committing, run `npm run push` to:
	- `pull --rebase`
	- `npm test`
	- `npm version`
	- `npm publish`
	- `git push`

Our [SemVer](http://semver.org/) policy is, in short:

- changing the structure of the exports is a `major` bump.
- adding a new area or revision of an area merits a `minor` bump.
- adding a test or fixing a bug is a `patch` bump.
