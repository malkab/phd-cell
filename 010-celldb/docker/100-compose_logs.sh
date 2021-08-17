#!/bin/bash

# Version: 2021-07-21

# -----------------------------------------------------------------
#
# Describe the purpose of the script here.
#
# -----------------------------------------------------------------
#
# Logs a Compose. Allows for an argument to pass as a grep
# command parameter.
#
# -----------------------------------------------------------------
# Check mlkctxt to check. If void, no check will be performed. If NOTNULL,
# any activated context will do, but will fail if no context was activated.
MATCH_MLKCTXT=common
# Project name, can be blank. Take into account that the folder name
# will be used, there can be name clashes. Defaults to empty.
PROJECT_NAME=cell_db_development
# Will grep lines to this term. If empty, all lines will be shown.
GREP=
# Follow. Defaults to "true" (unquoted).
FOLLOW=
# Show timestamps. Defaults to "true" (unquoted).
TIMESTAMPS=
# Tail. Defaults to "100" (unquoted).
TAIL=





# ---

# Check mlkctxt is present at the system
if command -v mlkctxt &> /dev/null ; then

  if ! mlkctxt -c $MATCH_MLKCTXT ; then exit 1 ; fi

fi

# Timestamps
TIMESTAMPS_F="-t"
if [ "$TIMESTAMPS" = false ] ; then TIMESTAMPS_F= ; fi

# Follow
FOLLOW_F="-f"
if [ "$FOLLOW" = false ] ; then FOLLOW_F= ; fi

# Project name
PROJECT_NAME_F=
if [ ! -z "${PROJECT_NAME}" ] ; then PROJECT_NAME_F="-p ${PROJECT_NAME}" ; fi

# Tail
TAIL_F="--tail 100"
if [ ! -z "${TAIL}" ] ; then TAIL_F="--tail ${TAIL}" ; fi

# Grep
GREP_F=
if [ ! -z "${GREP}" ] ; then GREP_F="|grep ${GREP}" ; fi

eval  docker-compose \
        $PROJECT_NAME_F \
        logs \
        $TIMESTAMPS_F \
        $FOLLOW_F \
        $TAIL_F \
        $GREP_F
