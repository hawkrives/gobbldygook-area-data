from collections import OrderedDict
from argparse import ArgumentParser
import hashlib
import json
import os

def json_folder_map(folders, kind):
	output = {}

	for folder_name in folders:
		files = os.listdir(folder_name)
		output[folder_name] = []
		for filename in files:
			if filename.split('.')[1] != 'json':
				continue

			path = folder_name + '/' + filename
			with open(path, 'rb') as infile:
				info = {
					'path': path,
					'hash': hashlib.sha1(infile.read()).hexdigest()
				}
				output[folder_name].append(OrderedDict(sorted(info.items())))
		
		output[folder_name] = sorted(output[folder_name], key=lambda item: item['path'])

	output = OrderedDict(sorted(
		{
			'info': OrderedDict(sorted(output.items())), 
			'type': kind
		}.items()
	))

	with open('info.json', 'w') as outfile:
		outfile.write(json.dumps(output, indent='\t', separators=(',', ': ')))
		outfile.write('\n')

	print('Hashed files; wrote info.json')


if __name__ == '__main__':
	argparser = ArgumentParser()
	argparser.add_argument('--folders', '-f', type=str, nargs='*', help='Folders to process')
	argparser.add_argument('--kind', '-k', type=str, nargs='*', help='Kind of data')
	args = argparser.parse_args()
	# print(args)
	json_folder_map(
		folders=args.folders or ['degrees', 'majors', 'concentrations'],
		kind=args.kind or 'areas'
	)
