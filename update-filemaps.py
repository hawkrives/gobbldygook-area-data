from collections import OrderedDict
import hashlib
import json
import os

def main():
	areasOfStudy = ['degrees', 'majors', 'concentrations']
	output = {}

	for area in areasOfStudy:
		files = os.listdir(area)
		output[area] = []
		for filename in files:
			path = area + '/' + filename 
			with open(path, 'rb') as infile:
				info = {
					'path': path, 
					'hash': hashlib.sha1(infile.read()).hexdigest()
				}
				output[area].append(OrderedDict(sorted(info.items())))
		output[area] = sorted(output[area], key=lambda item: item['path'])

	output = OrderedDict(sorted(output.items()))

	with open('info.json', 'w') as outfile:
		outfile.write(json.dumps(output, separators=(',',':')))

	print('Hashed files; wrote info.json')

if __name__ =  '__main__':
	main()
