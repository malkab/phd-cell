#!/bin/bash

# Builds and publish the new image

# Check mlkcontext to check. If void, no check will be performed
MATCH_MLKCONTEXT=production_image





# ---

# Check mlkcontext
if [ ! -z "${MATCH_MLKCONTEXT}" ] ; then

  if [ ! "$(mlkcontext)" = "$MATCH_MLKCONTEXT" ] ; then

    echo Please initialise context $MATCH_MLKCONTEXT

    exit 1

  fi

fi

# Build and push

cd 010-sunnsaas_v1_db

./010-build.sh
./020-push.sh

cd ..

cd ./020-sunnsaas_v1_redis

./010-build.sh
./020-push.sh

cd ..

cd ./030-sunnsaas_v1_api

./010-build.sh
./020-push.sh

cd ..
