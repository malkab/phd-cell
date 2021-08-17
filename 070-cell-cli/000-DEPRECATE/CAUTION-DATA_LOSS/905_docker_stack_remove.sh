#!/bin/bash

# Version: 2021-01-25

# -----------------------------------------------------------------
#
# Document the purpose of the script here.
#
# -----------------------------------------------------------------
#
# Removes a SWARM stack.
#
# -----------------------------------------------------------------
# Check mlkctxt to check. If void, no check will be performed.
MATCH_MLKCTXT=
# The stack name.
STACKNAME=cell_raw_data





# ---

# Check mlkctxt is present at the system
if command -v mlkctxt &> /dev/null ; then

  if ! mlkctxt -c $MATCH_MLKCTXT ; then exit 1 ; fi

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
