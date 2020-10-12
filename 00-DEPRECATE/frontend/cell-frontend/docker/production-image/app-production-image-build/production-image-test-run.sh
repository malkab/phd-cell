#!/bin/bash

# Runs and test the production image

. ../env

PORT=8080

docker run -ti --rm \
    -p "${PORT}:80" \
    $IMAGENAME:$APPVERSION
