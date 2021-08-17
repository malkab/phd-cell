#!/bin/bash

# Version: 2021-07-23

# -----------------------------------------------------------------
#
# Document the purpose of the script here.
#
# -----------------------------------------------------------------
#
# Updates an stack from the GitLab registry.
#
# -----------------------------------------------------------------
# Check mlkctxt to check. If void, no check will be performed.
MATCH_MLKCTXT=
# The stack name. Mandatory.
STACKNAME=cell_postgis
# Target default compose. Defaults to "docker-compose.yaml" (unquoted).
DOCKER_COMPOSE=





# ---

# Check mlkctxt is present at the system
if command -v mlkctxt &> /dev/null ; then

  if ! mlkctxt -c $MATCH_MLKCTXT ; then exit 1 ; fi

fi

# Check for STACKNAME
if [ -z "${STACKNAME}" ] ; then

  echo STACKNAME is mandatory, exiting...
  exit 1

fi

# Docker compose file
DOCKER_COMPOSE_F="-c docker-compose.yaml"
if [ ! -z "${DOCKER_COMPOSE}" ] ; then DOCKER_COMPOSE_F="-c ${DOCKER_COMPOSE}" ; fi

# Final command
eval docker stack deploy $DOCKER_COMPOSE_F $STACKNAME
