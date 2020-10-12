#!/bin/bash

# Runs and test the production image

. ../env

docker run -ti --rm \
    $IMAGENAME:$APPVERSION
