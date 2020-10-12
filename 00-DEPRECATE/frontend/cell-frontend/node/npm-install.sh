#!/bin/bash

# Installs fresh project dependencies

# This script installs all npm packages
NPM_REGISTRY="https://registry.npmjs.org"
# NPM_REGISTRY="32.42.31.124"

echo
echo ----------------
echo Installing globals...
echo ----------------
echo

npm install -g --registry $NPM_REGISTRY \
        webpack \
        webpack-cli \
        typescript@">=2.7.2 <2.10"


echo
echo ----------------
echo Installing dev dependencies...
echo ----------------
echo

npm install --registry $NPM_REGISTRY --save-dev \
        @angular/cli \
        @angular/compiler \
        @angular/compiler-cli \
        @angular/forms \
        @angular/http \
        @angular/common \
        @angular/core \
        @angular/language-service \
        @angular/platform-browser \
        @angular/platform-browser-dynamic \
        @angular/router \
        @types/d3 \
        @types/leaflet \
        @types/node \
        @types/proj4 \
        @types/pixi.js \
        angular2-template-loader \
        clean-webpack-plugin \
        core-js \
        css-loader \
        csv-loader \
        favicons-webpack-plugin \
        file-loader \
        html-loader \
        html-webpack-include-assets-plugin \
        html-webpack-plugin \
        node-sass \
        rxjs \
        sass \
        sass-loader \
        style-loader \
        to-string-loader \
        transfer-webpack-plugin \
        ts-loader \
        ts-node \
        tslint \
        typescript@">=2.7.2 <2.10" \
        uglifyjs-webpack-plugin \
        webpack \
        webpack-cli \
        webpack-dev-server \
        xml-loader \
        zone.js \
        papaparse


echo
echo ----------------
echo Installing dependencies...
echo ----------------
echo

npm install --registry $NPM_REGISTRY --save \
        @angular/animations \
        @angular/cdk \
        @angular/common \
        @angular/core \
        @angular/material \
        d3 \
        hammerjs \
        leaflet \
        proj4 \
        pixi.js \
        universal-ga \
        zone.js
