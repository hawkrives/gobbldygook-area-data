PATH := ./node_modules/.bin:./bin:$(PATH)

all: bin/hanson-node.js
	node $< area-files/computer-science-major.txt

bin/hanson-node.js: bin/hanson.js
	babel --optional=runtime --stage=0 < $< > $@

FILES := computer-science-major.txt \
	asian-studies-major.txt

examine:
	python3 bin/split.py area-files/asian-studies-major.txt

test:
	python3 bin/split.py area-files/computer-science-major.txt > tmp.txt
	diff tmp.txt stage-1/csci-m.txt

	python3 bin/split.py area-files/asian-studies-major.txt > tmp.txt
	diff tmp.txt stage-1/asian-m.txt

	rm tmp.txt

clean:
	rm -f bin/hanson-node.js
