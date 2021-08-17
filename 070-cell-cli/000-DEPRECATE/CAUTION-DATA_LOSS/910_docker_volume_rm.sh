#!/bin/bash

# Version 2020-08-07

# -----------------------------------------------------------------
#
# Document purpose of script here.
#
# -----------------------------------------------------------------
#
# Remove Docker volumes.
#
# -----------------------------------------------------------------

# Check mlkcontext to check. If void, no check will be performed
MATCH_MLKCONTEXT=
# Volumes to be deleted here
VOLUMES=(
  cell_raw_data_postgis
)





# ---

# Check mlkcontext
if [ ! -z "${MATCH_MLKCONTEXT}" ] ; then

  if [ ! "$(mlkcontext)" = "$MATCH_MLKCONTEXT" ] ; then

    echo Please initialise context $MATCH_MLKCONTEXT

    exit 1

  fi

fi

VOLUMES_F=

if [ ! -z "${VOLUMES}" ] ; then

  for E in "${VOLUMES[@]}" ; do

    echo $E

    VOLUMES_F="${VOLUMES_F} ${E} "

  done

fi

read -p "BEWARE!!! Going to clear the above volumes. Proceed? (y/N): " -t 10 str

if [ "$str" == "y" ]
then

  docker volume rm $VOLUMES_F

else

    exit 0

fi
