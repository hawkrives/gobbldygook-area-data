PATH := ./node_modules/:$(PATH)

hanson := babel-node ./static-areas/bin/hanson-to-json.js

all: bin/hanson-to-json node_modules/parse-hanson-string/index.js

areas-of-study: areas/**/*.yaml
	cp -r areas/ dist/
	@for file in $(^); do \
		echo $$file; \
		$(hanson) $$file; \
	done

bin/hanson-to-json: static-areas/bin/hanson-to-json.js
	babel $(<) > $(@)
	chmod +x $(@)

node_modules/parse-hanson-string/index.js: static-areas/bin/hanson-string.pegjs
	mkdir -p ./node_modules/parse-hanson-string/
	pegjs < $(<) | babel > $(@)

clean:
	$(RM) \
		node_modules/parse-hanson-string/index.js \
		bin/hanson-to-json

.PHONY: clean
