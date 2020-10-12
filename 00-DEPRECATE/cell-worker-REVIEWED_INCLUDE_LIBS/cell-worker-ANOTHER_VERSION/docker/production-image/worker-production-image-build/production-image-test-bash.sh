#!/bin/bash

# Runs a bash session into the production image

. ../env

docker run -ti --rm \
    --entrypoint /bin/bash \
    --workdir / \
    $IMAGENAME:$APPVERSION
