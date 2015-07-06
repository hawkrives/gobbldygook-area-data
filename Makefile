PATH := ./node_modules/.bin/:$(PATH)

all: bin/hanson bin/check


areas-of-study: bin/hanson-to-json areas/**/*.yaml
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


lib/parse-hanson-string.js: lib/hanson-string.pegjs
	pegjs < $(<) | babel > $(@)

build/hanson.js: src/hanson.js lib/parse-hanson-string.js
	babel < $(<) > $(@)

build/evaluate.js: src/evaluate.js
	babel < $(<) > $(@)


test: bin/check
	$(<) ./dist/majors/studio-art.json ./student.json

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
