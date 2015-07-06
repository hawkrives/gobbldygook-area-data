PATH := ./node_modules/.bin/:$(PATH)

all: bin/hanson-to-json lib/parse-hanson-string.js

areas-of-study: bin/hanson-to-json areas/**/*.yaml
	rm -rf dist/
	cp -r areas/ dist/
	@for file in dist/**/*.yaml; do \
		echo; \
		echo $$file; \
		./bin/hanson-to-json $$file; \
	done

bin/hanson-to-json: src/hanson-to-json.js lib/parse-hanson-string.js
	babel $(<) > $(@)
	chmod +x $(@)

lib/parse-hanson-string.js: lib/hanson-string.pegjs
	pegjs < $(<) | babel > $(@)
	mkdir -p ./node_modules/parse-hanson-string/
	cp -f $(@) node_modules/parse-hanson-string/index.js

test: bin/evaluate
	./bin/evaluate ./dist/majors/studio-art.json ./student.json

bin/evaluate: src/evaluate.js student.json
	babel < $(<) > $(@)
	chmod +x $(@)

clean:
	$(RM) \
		node_modules/parse-hanson-string/index.js \
		lib/parse-hanson-string.js \
		bin/hanson-to-json

.PHONY: clean test areas-of-study all
