#!/bin/bash

# Runs an interactive session for development

CONTAINERNAME=boilerplate-webpack-angular6-testing
DEBUGPORT=9007
NODEVERSION=v10.9.0


# In Docker, FRONTENDPORT must match the internal container port
# for Zone.js sockets to work properly
FRONTENDPORT=8085


docker run -ti --rm \
    --name $CONTAINERNAME \
    -v `pwd`/../../node/:`pwd`/../../node/ \
    --workdir `pwd`/../../node/ \
    --entrypoint /bin/bash \
    -e "VERSION=0.0.1" \
    -p $DEBUGPORT:9229 \
    -p $FRONTENDPORT:8085 \
    malkab/nodejs-dev:$NODEVERSION
