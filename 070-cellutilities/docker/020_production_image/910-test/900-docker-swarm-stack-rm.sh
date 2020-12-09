#!/bin/bash

# Version 2020-10-13

# -----------------------------------------------------------------
#
# Document the purpose of the script here.
#
# -----------------------------------------------------------------
#
# Removes a SWARM stack.
#
# -----------------------------------------------------------------

# Check mlkcontext to check. If void, no check will be performed.
MATCH_MLKCONTEXT=production_image
# The stack name
STACKNAME=${MLKC_SUNNSAAS_APP_NAME}_production_test





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

# Remember that old volumes will be used

echo

echo --------
echo WARNING!
echo --------

echo Remember that old volumes will continue to be used.

echo


# Removes the stack
docker stack rm $STACKNAME
