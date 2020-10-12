#!/bin/bash

# Builds the production images

if [[ ! -f ./env ]] ; then

    echo
    echo Configure env.configure and rename it to env before running this script!!!
    echo
    exit 0

fi

. ./env


# Prepare version information

VERSION="${APPVERSION} - Build $(date +"%Y%m%d-%H%M%S") - Node ${NODEVERSION}"
export VERSION


# Insert here all the needed Dockerfile.template substitutions
# for the different images in the stack

echo Building $VERSION
sed \
    -e "s/##VERSION##/${VERSION}/g" \
    -e "s/##NODEVERSION##/${NODEVERSION}/g" \
    app-production-image-build/Dockerfile.template > app-production-image-build/Dockerfile


# Process here all the production images needed
# for the different images in the stack

cd app-production-image-build
./build-production-image.sh
cd ..
