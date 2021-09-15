#!/bin/bash

# Version: 2021-07-19

# -----------------------------------------------------------------
#
# Removes the compose completely.
#
# -----------------------------------------------------------------
#
# Downs a compose. With TIMEOUT=0 it is fulminated. Stops and removes
# containers, networks, and volumes, if specified.
#
# -----------------------------------------------------------------
# Check mlkctxt to check. If void, no check will be performed. If NOTNULL,
# any activated context will do, but will fail if no context was activated.
MATCH_MLKCTXT=common
# Project name, can be blank. Take into account that the folder name will be
# used, there can be name clashes.
PROJECT_NAME=cell_db_development
# Compose file, defaults to void, which used the local folder
# docker-compose.yaml.
COMPOSE_FILE=
# Stop timeout, defaults to "0" (without quotes).
TIMEOUT=30
# Drop anonymous volumes. Defaults to true.
REMOVE_ANONYMOUS_VOLUMES=





# ---

# Check mlkctxt is present at the system
if command -v mlkctxt &> /dev/null ; then

  if ! mlkctxt -c $MATCH_MLKCTXT ; then exit 1 ; fi

fi

# Compose file
COMPOSE_FILE_F=
if [ ! -z "${COMPOSE_FILE}" ] ; then COMPOSE_FILE_F="-f ${COMPOSE_FILE}" ; fi

# Timeout
TIMEOUT_F=0
if [ ! -z "${TIMEOUT}" ] ; then TIMEOUT_F=$TIMEOUT ; fi

# Project name
PROJECT_NAME_F=
if [ ! -z "${PROJECT_NAME}" ] ; then PROJECT_NAME_F="-p ${PROJECT_NAME}" ; fi

# Remove anymous volumes
REMOVE_ANONYMOUS_VOLUMES_F="-v"
if [ "$REMOVE_ANONYMOUS_VOLUMES" = false ] ; then REMOVE_ANONYMOUS_VOLUMES_F= ; fi

# Final command
eval docker-compose \
  $COMPOSE_FILE_F $PROJECT_NAME_F down -t $TIMEOUT_F $REMOVE_ANONYMOUS_VOLUMES_F
