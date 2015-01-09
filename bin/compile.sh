#!/bin/sh

mkdir -p dist/
6to5 index.js --out-dir dist/

for folder in concentration degree emphasis lib major; do
	mkdir -p "dist/$folder"
	6to5 "$folder" --out-dir "dist/$folder"
done
