#!/bin/bash

# Version: 2021-07-21

# -----------------------------------------------------------------
#
# Removes the compose.
#
# -----------------------------------------------------------------
#
# Removes a Compose containers, not showing in "docker ps -a". Networks are
# unaffected.
#
# -----------------------------------------------------------------
# Check mlkctxt to check. If void, no check will be performed. If NOTNULL,
# any activated context will do, but will fail if no context was activated.
MATCH_MLKCTXT=common
# Project name, can be blank. Take into account that the folder name will be
# used, there can be name clashes. Defaults to empty.
PROJECT_NAME=cell_db_development
# Drop anonymous volumes. Defaults to true.
REMOVE_ANONYMOUS_VOLUMES=





# ---

# Check mlkctxt is present at the system
if command -v mlkctxt &> /dev/null ; then

  if ! mlkctxt -c $MATCH_MLKCTXT ; then exit 1 ; fi

fi

# Project name
PROJECT_NAME_F=
if [ ! -z "${PROJECT_NAME}" ] ; then PROJECT_NAME_F="-p ${PROJECT_NAME}" ; fi

# Remove anymous volumes
REMOVE_ANONYMOUS_VOLUMES_F="-v"
if [ "$REMOVE_ANONYMOUS_VOLUMES" = false ] ; then REMOVE_ANONYMOUS_VOLUMES_F= ; fi

# Final command
eval docker-compose $PROJECT_NAME_F rm $REMOVE_ANONYMOUS_VOLUMES_F
