PATH := ./node_modules/.bin/:$(PATH)

all: bin/hanson bin/check bin/parse bin/full build/*.js


areas-of-study: bin/hanson areas/**/*.yaml
	rm -rf dist/
	cp -r areas/ dist/
	@for file in dist/**/*.yaml; do \
		echo; \
		echo $$file; \
		./bin/hanson $$file; \
	done


bin/check: bin/check.js build/evaluate.js
	babel < $(<) > $(@)
	chmod +x $(@)

bin/full: bin/full.js build/evaluate.js build/hanson.js
	babel < $(<) > $(@)
	chmod +x $(@)

bin/hanson: bin/hanson.js build/hanson.js
	babel < $(<) > $(@)
	chmod +x $(@)

bin/parse: bin/parse.js lib/parse-hanson-string.js
	babel < $(<) > $(@)
	chmod +x $(@)


lib/parse-hanson-string.js: lib/hanson-string.pegjs
	pegjs < $(<) | babel --compact 'true' > $(@)

build: build/hanson.js build/evaluate.js build/isRequirementName.js

build/hanson.js: src/hanson.js lib/parse-hanson-string.js
	mkdir -p build
	babel < $(<) > $(@)

build/%.js: src/%.js
	mkdir -p build
	babel < $(<) > $(@)


test-sa: bin/full
	$(<) --json ./areas/majors/studio-art.yaml ./example-students/studio-art.json

test-as: bin/full
	$(<) --json ./areas/majors/asian-studies.yaml ./example-students/asian-studies.json

test-ba: bin/full
	$(<) --json ./areas/degrees/bachelor-of-arts.yaml ./example-students/ba.json

test-spanish: bin/full
	$(<) --json ./areas/majors/spanish.yaml.ip ./example-students/spanish.json # | jq "."


test:
	mocha

lint:
	eslint src/


clean:
	$(RM) \
		lib/parse-hanson-string.js \
		bin/hanson \
		bin/full \
		bin/parse \
		bin/check
	rm -rf build/

.PHONY: clean test areas-of-study all


cover:
	babel-node ./node_modules/.bin/isparta cover ./node_modules/.bin/_mocha

codecover:
	babel-node ./node_modules/.bin/isparta cover ./node_modules/.bin/_mocha -- -R spec \
		&& ./node_modules/codecov.io/bin/codecov.io.js < ./coverage/coverage.json
