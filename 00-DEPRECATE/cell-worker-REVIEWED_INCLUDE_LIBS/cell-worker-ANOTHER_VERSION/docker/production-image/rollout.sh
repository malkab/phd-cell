#!/bin/bash

# Builds the production images

if [[ ! -f ./env ]] ; then

    echo
    echo Configure env.configure and rename it to env before running this script!!!
    echo
    exit 0

fi

. ./env


echo Building $VERSION
echo


# Process here all the production images needed
# for the different images in the stack

cd worker-production-image-build
./build-production-image.sh
cd ..
