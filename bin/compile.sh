#!/bin/sh

mkdir -p dist/
babel index.js --out-dir dist/
babel src/ --out-dir dist/
