PATH := ./node_modules/.bin/:$(PATH)

all: bin/hanson bin/check bin/parse


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

bin/hanson: bin/hanson.js build/hanson.js
	babel < $(<) > $(@)
	chmod +x $(@)

bin/parse: bin/parse.js lib/parse-hanson-string.js
	babel < $(<) > $(@)
	chmod +x $(@)


lib/parse-hanson-string.js: lib/hanson-string.pegjs
	pegjs < $(<) | babel > $(@)

build/hanson.js: src/hanson.js lib/parse-hanson-string.js
	mkdir -p build
	babel < $(<) > $(@)

build/evaluate.js: src/evaluate.js
	mkdir -p build
	babel < $(<) > $(@)


test: bin/check
	$(<) --json ./dist/majors/studio-art.json ./student.json

mocha:
	mocha

lint:
	eslint src/


clean:
	$(RM) \
		lib/parse-hanson-string.js \
		bin/hanson \
		bin/check

.PHONY: clean test areas-of-study all
