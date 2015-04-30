PATH := ./node_modules/.bin:$(PATH)

all: bin/hanson-node.js
	node $< area-files/computer-science-major.txt

bin/hanson-node.js: bin/hanson.js
	babel --optional=runtime --stage=0 < $< > $@

clean:
	rm -f bin/hanson-node.js
