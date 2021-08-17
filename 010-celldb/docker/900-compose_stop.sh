#!/bin/bash

# Version: 2021-07-21

# -----------------------------------------------------------------
#
# Stops the compose.
#
# -----------------------------------------------------------------
#
# Stops a compose. Stops the containers defined by the Compose, not removing
# them, being shown with "docker ps -a". Networks are unaffected.
#
# -----------------------------------------------------------------
# Check mlkctxt to check. If void, no check will be performed. If NOTNULL,
# any activated context will do, but will fail if no context was activated.
MATCH_MLKCTXT=common
# Project name, can be blank. Take into account that the folder name will be
# used, there can be name clashes. Defaults to empty.
PROJECT_NAME=cell_db_development
# Stop timeout, defaults to "0" (without quotes).
TIMEOUT=30





# ---

# Check mlkctxt is present at the system
if command -v mlkctxt &> /dev/null ; then

  if ! mlkctxt -c $MATCH_MLKCTXT ; then exit 1 ; fi

fi

# Project name
PROJECT_NAME_F=
if [ ! -z "${PROJECT_NAME}" ] ; then PROJECT_NAME_F="-p ${PROJECT_NAME}" ; fi

# Timeout
TIMEOUT_F=0
if [ ! -z "${TIMEOUT}" ] ; then TIMEOUT_F=$TIMEOUT ; fi

# Final command
eval docker-compose $PROJECT_NAME_F stop -t $TIMEOUT_F
