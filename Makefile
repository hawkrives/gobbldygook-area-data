PATH := ./node_modules/:$(PATH)

static-areas/bin/parse-hanson-string.js: static-areas/bin/hanson-string.pegjs
	pegjs < $(<) | babel > $(@)

clean:
	$(RM) static-areas/bin/parse-hanson-string.js

.PHONY: clean
