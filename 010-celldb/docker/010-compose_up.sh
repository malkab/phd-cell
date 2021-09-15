#!/bin/bash

# Version: 2021-07-21

# -----------------------------------------------------------------
#
# Describe the purpose of the script here.
#
# -----------------------------------------------------------------
#
# Starts a Docker Compose. Try to clean development Composes once they are not
# used to keep docker ps -a as clean as possible.
#
# -----------------------------------------------------------------
# Check mlkctxt to check. If void, no check will be performed. If NOTNULL,
# any activated context will do, but will fail if no context was activated.
MATCH_MLKCTXT=common
# Project name, can be blank. Take into account that the folder name
# will be used, there can be name clashes. Defaults to empty.
PROJECT_NAME=cell_db_development
# Compose file, defaults to void, which used the local folder
# docker-compose.yaml.
COMPOSE_FILE=
# Detach. Defaults to "true" (unquoted).
DETACH=false





# ---

# Check mlkctxt is present at the system
if command -v mlkctxt &> /dev/null ; then

  if ! mlkctxt -c $MATCH_MLKCTXT ; then exit 1 ; fi

fi

# Compose file
COMPOSE_FILE_F=
if [ ! -z "${COMPOSE_FILE}" ] ; then COMPOSE_FILE_F="-f ${COMPOSE_FILE}" ; fi

# Project name
PROJECT_NAME_F=
if [ ! -z "${PROJECT_NAME}" ] ; then PROJECT_NAME_F="-p ${PROJECT_NAME}" ; fi

# Detach
DETACH_F="-d"
if [ "$DETACH" = false ] ; then DETACH_F= ; fi

# Final command
eval docker-compose $COMPOSE_FILE_F $PROJECT_NAME_F up $DETACH_F