#!/bin/bash

# Runs a bash session into the production image

. ../env

PORT=8080

docker run -ti --rm \
    --entrypoint /bin/bash \
    --workdir / \
    -p "${PORT}:80" \
    $IMAGENAME:$APPVERSION
