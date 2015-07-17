PATH := ./node_modules/.bin/:$(PATH)


test-sa:
	babel-node ./bin/run --json ./areas/majors/studio-art.yaml ./example-students/studio-art.json

test-as:
	babel-node ./bin/run --json ./areas/majors/asian-studies.yaml ./example-students/asian-studies.json

test-ba:
	babel-node ./bin/run --json ./areas/degrees/bachelor-of-arts.yaml ./example-students/ba.json

test-spanish:
	babel-node ./bin/run --json ./areas/majors/spanish.yaml.ip ./example-students/spanish.json


.PHONY: clean
