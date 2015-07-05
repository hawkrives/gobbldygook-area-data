PATH := ./bin:$(PATH)

FILES := stage-1/computer-science-major.txt \
	stage-1/asian-studies-major.txt \
	stage-1/theater-major.txt \
	stage-1/chemistry-major.txt \
	stage-1/studio-art-major.txt

examine:
	python3 bin/expand-yaml.py area-files/computer-science-major.txt
	# python3 bin/expand-yaml.py area-files/asian-studies-major.txt
	# python3 bin/expand-yaml.py area-files/theater-major.txt
	# python3 bin/expand-yaml.py area-files/chemistry-major.txt
	# python3 bin/expand-yaml.py area-files/studio-art-major.txt

stage-2:
	python3 bin/yaml-to-js.py
	# python3 bin/yaml-to-js.py stage-1/computer-science-major.txt

save: $(FILES)

test: save
	python3 bin/expand-yaml.py area-files/computer-science-major.txt  | diff stage-1/computer-science-major.txt -
	python3 bin/expand-yaml.py area-files/asian-studies-major.txt     | diff stage-1/asian-studies-major.txt -
	python3 bin/expand-yaml.py area-files/theater.txt                 | diff stage-1/theater-major.txt -
	python3 bin/expand-yaml.py area-files/chemistry-major.txt         | diff stage-1/chemistry-major.txt -
	python3 bin/expand-yaml.py area-files/studio-art.txt              | diff stage-1/studio-art-major.txt -

stage-1/%: area-files/$(*) expand-yaml
	python3 bin/expand-yaml.py area-files/$(*) > $(@)

expand-yaml: bin/expand-yaml.py
