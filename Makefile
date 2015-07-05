PATH := ./node_modules/:$(PATH)

hanson := babel-node ./static-areas/bin/hanson-to-json.js

all: bin/hanson-to-json lib/parse-hanson-string.js

areas-of-study: areas/**/*.yaml
	cp -r areas/ dist/
	@for file in $(^); do \
		echo $$file; \
		$(hanson) $$file; \
	done

bin/hanson-to-json: static-areas/bin/hanson-to-json.js
	babel $(<) > $(@)
	chmod +x $(@)

lib/parse-hanson-string.js: lib/hanson-string.pegjs
	pegjs < $(<) | babel > $(@)
	mkdir -p ./node_modules/parse-hanson-string/
	ln -fs $(@) node_modules/parse-hanson-string/index.js

clean:
	$(RM) \
		node_modules/parse-hanson-string/index.js \
		lib/parse-hanson-string.js \
		bin/hanson-to-json

.PHONY: clean
