#!/bin/bash

# -----------------------------------------------------------------
#
# Stops the compose.
#
# -----------------------------------------------------------------
#
# Stops a compose in the current folder.
#  
# -----------------------------------------------------------------

# Check mlk-context to check. If void, no check will be performed
MATCH_MLKCONTEXT=dev
# Stop timeout
TIMEOUT=10
# Project name, can be blank. Take into account that the folder name
# will be used, there can be name clashes
PROJECT_NAME=$MLKC_CELL_APP_NAME





# ---

# Check mlk-context

if [ ! -z "${MATCH_MLKCONTEXT}" ] ; then

  if [ ! "$(mlkcontext)" = "$MATCH_MLKCONTEXT" ] ; then

    echo Please initialise context $MATCH_MLKCONTEXT

    exit 1

  fi

fi


if [ ! -z "${PROJECT_NAME}" ] ; then

  PROJECT_NAME="-p ${PROJECT_NAME}"
  
fi


docker-compose $PROJECT_NAME stop -t $TIMEOUT
