#!/bin/bash

# exit if any commands error
set -e

git pull origin master

npm set progress false
npm i > /dev/null

npm run package
