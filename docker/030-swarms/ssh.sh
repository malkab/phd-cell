#!/bin/bash

# Version: 2020-12-14

# -----------------------------------------------------------------
#
# SSH into the host.
#
# -----------------------------------------------------------------
#
# SSH to a host.
#
# -----------------------------------------------------------------

# Check mlkcontext to check. If void, no check will be performed.
MATCH_MLKCONTEXT=
# Remote SSH username.
USER_NAME=$MLKC_SYSTEM_37NORTH_USER
# Host.
HOST=$MLKC_SYSTEM_37NORTH_HOST
# SSH port.
SSH_PORT=22
# Amazon AWS PEM key (it´s a path to a file).
AWS_PEM=





# ---

# Check mlkcontext is present at the system
if command -v mlkcontext &> /dev/null
then

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
