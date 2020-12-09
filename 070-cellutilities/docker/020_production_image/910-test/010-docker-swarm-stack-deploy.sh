#!/bin/bash

# Version 2020-10-13

# -----------------------------------------------------------------
#
# Document the purpose of the script here.
#
# -----------------------------------------------------------------
#
# Updates an stack from the GitLab registry.
#
# -----------------------------------------------------------------

# Check mlkcontext to check. If void, no check will be performed
MATCH_MLKCONTEXT=production_image
# The stack name
STACKNAME=${MLKC_SUNNSAAS_APP_NAME}_production_test
# Target default compose
DOCKER_COMPOSE=docker-compose.yaml





# ---

echo -------------
echo WORKING AT $(mlkcontext)
echo -------------

# Check mlkcontext

if [ ! -z "${MATCH_MLKCONTEXT}" ] ; then

  if [ ! "$(mlkcontext)" = "$MATCH_MLKCONTEXT" ] ; then

    echo Please initialise context $MATCH_MLKCONTEXT

    exit 1

  fi

fi


# Deploy the stack
docker stack deploy -c $DOCKER_COMPOSE $STACKNAME
