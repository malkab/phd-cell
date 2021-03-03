#!/bin/bash

# Version 2020-10-10

# -----------------------------------------------------------------
#
# Removes the compose.
#
# -----------------------------------------------------------------
#
# Removes a compose.
#
# -----------------------------------------------------------------

# Check mlkcontext to check. If void, no check will be performed
MATCH_MLKCONTEXT=common
# Project name, can be blank. Take into account that the folder name
# will be used, there can be name clashes
PROJECT_NAME=$MLKC_CELL_APP
# Drop volumes
REMOVE_ANONYMOUS_VOLUMES=true





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

if [ "$REMOVE_ANONYMOUS_VOLUMES" = true ] ; then

  REMOVE_ANONYMOUS_VOLUMES="-v"

else

  REMOVE_ANONYMOUS_VOLUMES=

fi

if [ ! -z "${PROJECT_NAME}" ] ; then

  PROJECT_NAME="-p ${PROJECT_NAME}"

fi

eval docker-compose $PROJECT_NAME rm $REMOVE_ANONYMOUS_VOLUMES
