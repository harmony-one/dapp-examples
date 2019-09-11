#!/bin/bash

rm -rf ../puzzle_static/*
npm run build
cp -rf dist/* ../puzzle_static/

git status

git add -u
git add ../puzzle_static/static
git add ../puzzle_static/index.html

git status
