#!/bin/bash

# exit if any commands error
set -e

PATH=/home/users/rives/bin/:$PATH
node -v

git pull origin master

npm set progress false
npm i > /dev/null

npm run package
