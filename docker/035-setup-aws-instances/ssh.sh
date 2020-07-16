#!/bin/bash

# -----------------------------------------------------------------
#
# SSH to sunnsaas-api-out-dev, dev deployment at LightSail for 
# Nacho and me.
#
# -----------------------------------------------------------------
#
# SSH to a host.
#  
# -----------------------------------------------------------------

# Check mlk-context to check. If void, no check will be performed
MATCH_MLK_CONTEXT=
# Remote SSH username
USER_NAME=$MLKC_CELL_API_USER
# Host
HOST=$MLKC_CELL_API_HOST
# SSH port
SSH_PORT=$MLKC_SSH_PORT
# Amazon AWS PEM key (it´s a path to a file)
AWS_PEM=$MLKC_CELL_API_PEM

echo -------------
echo WORKING: $(mlkcontext)
echo -------------





# ---

# Check mlk-context

if [ ! -z "${MATCH_MLK_CONTEXT}" ] ; then

  if [ ! "$(mlkcontext)" = "$MATCH_MLK_CONTEXT" ] ; then

    echo Please initialise context $MATCH_MLK_CONTEXT

    exit 1

  fi

fi


# Amazon PEM

if [ ! -z $AWS_PEM ] ; then

    RSH_OPTIONS="-i ${AWS_PEM} -p ${SSH_PORT}"

else

    RSH_OPTIONS="-p ${SSH_PORT}"

fi


# The command

SSH="ssh ${RSH_OPTIONS} "


# Command

RSYNC="${SSH} ${USER_NAME}@${HOST}"

# eval $RSYNC

eval $RSYNC
