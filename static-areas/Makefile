PATH := ./bin:$(PATH)

FILES := computer-science-major.txt \
	asian-studies-major.txt \
	theater.txt \
	chemistry-major.txt \
	studio-art.txt

examine:
	python3 bin/expand-yaml.py area-files/computer-science-major.txt
	# python3 bin/expand-yaml.py area-files/asian-studies-major.txt
	# python3 bin/expand-yaml.py area-files/theater.txt
	# python3 bin/expand-yaml.py area-files/chemistry-major.txt
	# python3 bin/expand-yaml.py area-files/studio-art.txt

save:
	python3 bin/expand-yaml.py area-files/computer-science-major.txt  > stage-1/csci-m.txt
	python3 bin/expand-yaml.py area-files/asian-studies-major.txt     > stage-1/asian-m.txt
	python3 bin/expand-yaml.py area-files/theater.txt                 > stage-1/theat-m.txt
	python3 bin/expand-yaml.py area-files/chemistry-major.txt         > stage-1/chem-m.txt
	python3 bin/expand-yaml.py area-files/studio-art.txt              > stage-1/sart-m.txt

test:
	python3 bin/expand-yaml.py area-files/computer-science-major.txt  | diff stage-1/csci-m.txt -
	python3 bin/expand-yaml.py area-files/asian-studies-major.txt     | diff stage-1/asian-m.txt -
	python3 bin/expand-yaml.py area-files/theater.txt                 | diff stage-1/theat-m.txt -
	python3 bin/expand-yaml.py area-files/chemistry-major.txt         | diff stage-1/chem-m.txt -
	python3 bin/expand-yaml.py area-files/studio-art.txt              | diff stage-1/sart-m.txt -
