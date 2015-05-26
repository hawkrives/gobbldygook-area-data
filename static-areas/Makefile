PATH := ./node_modules/.bin:./bin:$(PATH)

all: bin/hanson-node.js
	node $< area-files/computer-science-major.txt

bin/hanson-node.js: bin/hanson.js
	babel --optional=runtime --stage=0 < $< > $@

FILES := computer-science-major.txt \
	asian-studies-major.txt

save:
	python3 bin/split.py area-files/computer-science-major.txt > stage-1/csci-m.txt
	python3 bin/split.py area-files/asian-studies-major.txt > stage-1/asian-m.txt
	python3 bin/split.py area-files/theater.txt > stage-1/theat-m.txt
	python3 bin/split.py area-files/chemistry-major.txt > stage-1/chem-m.txt
	python3 bin/split.py area-files/studio-art.txt > stage-1/sart-m.txt

examine:
	# python3 bin/split.py area-files/computer-science-major.txt
	# python3 bin/split.py area-files/asian-studies-major.txt
	# python3 bin/split.py area-files/theater.txt
	# python3 bin/split.py area-files/chemistry-major.txt
	python3 bin/split.py area-files/studio-art.txt

test:
	python3 bin/split.py area-files/computer-science-major.txt > tmp.txt
	diff stage-1/csci-m.txt tmp.txt

	python3 bin/split.py area-files/asian-studies-major.txt > tmp.txt
	diff stage-1/asian-m.txt tmp.txt

	python3 bin/split.py area-files/theater.txt > tmp.txt
	diff stage-1/theat-m.txt tmp.txt

	python3 bin/split.py area-files/chemistry-major.txt > tmp.txt
	diff stage-1/chem-m.txt tmp.txt

	python3 bin/split.py area-files/studio-art.txt > tmp.txt
	diff stage-1/sart-m.txt tmp.txt

	rm tmp.txt

clean:
	rm -f bin/hanson-node.js
