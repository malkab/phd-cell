#!/bin/bash

# Interactive bash session for npm management

if [ -z "$1" ] ; then

    echo Specify debug port
    exit 1

fi

CONTAINERNAME=cell-cellworkder-dev
DEBUGPORT=$1
NODEVERSION=v10.9.0

docker run -ti --rm \
    -v `pwd`/../../node/:`pwd`/../../node/ \
    --workdir `pwd`/../../node/ \
    --entrypoint /bin/bash \
    --network cellapidev \
    -p $DEBUGPORT:9229 \
    -e "VERSION=development_testing" \
    -e "REDISURL=redis://redis" \
    -e "NODEMEMORY=100" \
    -e "REDISPORT=6379" \
    -e "REDISPASS=redis" \
    -e "REDISQUEUEAPIWORKER=queue:api-worker" \
    -e "REDISQUEUEWORKERAPI=queue:worker-api" \
    -e "REDISCHANNELWORKER=channel:worker" \
    -e "DOCKERHOST=$HOSTNAME" \
    -e "WORKERSHEARTBEAT=30" \
    -e "CELLDSHOST=dbcellds" \
    -e "CELLDSPORT=5432" \
    -e "CELLDSUSER=postgres" \
    -e "CELLDSPASS=postgres" \
    -e "CELLDSDB=cellds" \
    -e "POOLSIZE=150" \
    -e "LOOPINTERVAL=1" \
    -e "MEMORYLIMITINDEX=4" \
    malkab/nodejs-dev:$NODEVERSION
