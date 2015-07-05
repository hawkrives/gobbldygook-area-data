PATH := ./node_modules/:$(PATH)

static-areas/bin/hanson-peg.js: static-areas/bin/hanson-peg.pegjs
	pegjs < static-areas/bin/hanson-peg.pegjs | babel > static-areas/bin/hanson-peg.js

clean:
	$(RM) static-areas/bin/hanson-peg.js

.PHONY: clean
