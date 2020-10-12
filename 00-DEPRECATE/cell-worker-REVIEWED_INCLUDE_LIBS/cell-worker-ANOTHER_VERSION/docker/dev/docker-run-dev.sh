#!/bin/bash

if [ -z "$1" ] ; then

    echo Specify debug port
    exit 0

fi

CONTAINERNAME=cell-cellworkder-dev
DEBUGPORT=$1
NODEVERSION=v10.9.0

docker run -ti --rm \
    -v `pwd`/../../node/:`pwd`/../../node/ \
    --workdir `pwd`/../../node/ \
    --entrypoint "npm" \
    --network cellapidev \
    -p $DEBUGPORT:9229 \
    -e "VERSION=development_testing" \
    -e "REDISURL=redis://redis" \
    -e "NODE_MEMORY=8000" \
    -e "REDISPORT=6379" \
    -e "REDISPASS=redis" \
    -e "REDIS_QUEUE_API_WORKER=queue:api-worker" \
    -e "REDIS_QUEUE_WORKER_API=queue:worker-api" \
    -e "REDIS_CHANNEL_WORKER=channel:worker" \
    -e "DOCKER_HOST=$HOSTNAME" \
    -e "WORKERS_HEARTBEAT_MINUTES=1" \
    -e "CELLDS_HOST=dbcellds" \
    -e "CELLDS_PORT=5432" \
    -e "CELLDS_USER=postgres" \
    -e "CELLDS_PASS=postgres" \
    -e "CELLDS_DB=cellds" \
    -e "POOL_SIZE=20" \
    malkab/nodejs-dev:$NODEVERSION \
    start
