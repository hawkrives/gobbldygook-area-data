#!/bin/sh

git pull --rebase

npm test

version=''
read -p "New Version [major|minor|patch]: " version
npm version "$version"

npm publish

git push --follow-tags
