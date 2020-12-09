#!/bin/bash

# Drops production images

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

docker rmi -f \
  $MLKC_SUNNSAAS_DOCKER_PRODUCTION_PG \
  $MLKC_SUNNSAAS_DOCKER_PRODUCTION_REDIS \
  $MLKC_SUNNSAAS_DOCKER_PRODUCTION_API \
  $MLKC_SUNNSAAS_DOCKER_PRODUCTION_PG:$MLKC_SUNNSAAS_VERSION \
  $MLKC_SUNNSAAS_DOCKER_PRODUCTION_REDIS:$MLKC_SUNNSAAS_VERSION \
  $MLKC_SUNNSAAS_DOCKER_PRODUCTION_API:$MLKC_SUNNSAAS_VERSION
