#!/bin/bash

# Version: 2021-06-22

# -----------------------------------------------------------------
#
# SSH into the host.
#
# -----------------------------------------------------------------
#
# SSH to a host.
#
# -----------------------------------------------------------------
# Check mlkctxt to check. If void, no check will be performed. Use NOTNULL to
# enforce any context.
MATCH_MLKCTXT=NOTNULL
# Remote SSH username.
USER=$MLKC_SYSTEM_37NORTH_USER
# Host.
HOST=$MLKC_SYSTEM_37NORTH_HOST
# SSH port. Defaults to 22.
SSH_PORT=22
# Amazon AWS PEM key (it´s a path to a file).
AWS_PEM=





# ---

# Check mlkctxt
if command -v mlkctxt &> /dev/null ; then

  if ! mlkctxt -c $MATCH_MLKCTXT ; then exit 1 ; fi

fi

# Port
PORT_F=22
if [ ! -z "${PORT}" ] ; then PORT_F=$PORT ; fi

# Amazon PEM
if [ ! -z $AWS_PEM ] ; then

    RSH_OPTIONS="-i ${AWS_PEM} -p ${PORT_F}"

else

    RSH_OPTIONS="-p ${PORT_F}"

fi

# The command
SSH="ssh ${RSH_OPTIONS} "

# Command
RSYNC="${SSH} ${USER}@${HOST}"

# eval $RSYNC
eval $RSYNC
