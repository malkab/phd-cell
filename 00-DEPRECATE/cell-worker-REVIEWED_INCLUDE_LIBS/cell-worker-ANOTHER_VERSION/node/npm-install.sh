#!/bin/bash

# This script installs all npm packages
NPM_REGISTRY="https://registry.npmjs.org"
# NPM_REGISTRY="32.42.31.124"

echo
echo ----------------
echo Installing globals...
echo ----------------
echo

npm install -g --registry $NPM_REGISTRY \
        mocha \
        webpack \
        webpack-cli

echo
echo ----------------
echo Installing dev dependencies...
echo ----------------
echo

npm install --registry $NPM_REGISTRY --save-dev \
        clean-webpack-plugin \
        uglify \
        uglifyjs-webpack-plugin \
        webpack-node-externals \
        ts-loader \
        typescript \
        nodemon \
        npm-run-all \
        mocha \
        chai \
        @types/mocha \
        @types/chai \
        @types/node \
        @types/mathjs \
        tslint \
        webpack \
        webpack-cli \
        @types/pg \
        @types/lodash \
        @types/redis \
        @types/proj4 \
        typedoc \
        typedoc-plugin-markdown \
        typedoc-webpack-plugin

echo
echo ----------------
echo Installing dependencies...
echo ----------------
echo

npm install --registry $NPM_REGISTRY --save \
        @turf/turf \
        js-sha256 \
        pg \
        redis \
        mathjs \
        lodash \
        proj4


