#!/bin/sh

mkdir -p dist/
babel index.js --out-dir dist/

for folder in concentration degree emphasis lib major; do
	babel "$folder" --out-dir "dist/$folder"
done
