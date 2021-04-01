#!/bin/bash

# Version: 2021-03-31

# -----------------------------------------------------------------
#
# Run Python notebooks for ML on the Cell grid.
#
# -----------------------------------------------------------------
#
# Runs a Python environment.
#
# -----------------------------------------------------------------
# Check mlkctxt to check. If void, no check will be performed. If NOTNULL,
# any activated context will do, but will fail if no context was activated.
MATCH_MLKCTXT=NOTNULL
# By default, this image has an ENTRYPOINT that runs a script that creates the
# mapped user and, by default, runs an interactive bash session with that user.
# Alternatively, if COMMAND is not void, the given command will be executed by
# the mapped user.
COMMAND=
# The network to connect to. Remember that when attaching to the network of an
# existing container (using container:name) the HOST is "localhost". Also the
# host network can be connected using just "host".
NETWORK=host
# Container identifier root. This is used for both the container name (adding an
# UID to avoid clashing) and the container host name (without UID). Incompatible
# with NETWORK container:name option. If blank, a Docker engine default name
# will be assigned to the container.
ID_ROOT=cell_jupyter_ml
# Unique? If true, no container with the same name can be created. Defaults to
# true.
UNIQUE=
# Work dir. Use $(pwd) paths. Defaults to /.
WORKDIR=$(pwd)
# Run mode. Can be PERSISTABLE (-ti), VOLATILE (-ti --rm), or DAEMON (-d). If
# blank, defaults to VOLATILE.
RUN_MODE=
# The Python Docker image tag to use. Defaults to latest.
IMAGE_TAG=
# Declare volumes, a line per volume, complete in source:destination form. No
# strings needed, $(pwd)/../data/:/ext_src/ works perfectly. Defaults to ().
VOLUMES=$(pwd):$(pwd)
# Env vars. Use ENV_VAR_NAME_CONTAINER=ENV_VAR_NAME_HOST format. Defaults to ().
ENV_VARS=
# Open ports in the form (external:internal external:internal).
PORTS=
# Custom entrypoint, leave blank for using the image's built-in option, which is
# an interactive session with user mapping.
ENTRYPOINT=
# Entrypoint command. Don't mistake it with the COMMAND parameter above. This
# parameter will work with ENTRYPOINT. By default, ENTRYPOINT is a run command
# script that takes no parameters. Use only if the default ENTRYPOINT is
# changed.
ENTRYPOINT_COMMAND=
# Replicas. If RUN_MODE is VOLATILE will fail. If ID_ROOT is blank will also
# fail. Keep in mind replicas will share volumes and all other configuration
# set. They'll be named with a -# suffix. Will not use X11. Keep blank for no
# replicas.
REPLICAS=
# Use display for X11 host server in MAC, LINUX, or NONE. Defaults to NONE.
X11=
# Group and user ID for mapping the user. Defaults to 0.
PYTHONGROUPID=1000
PYTHONUSERID=1000





# ---

# Check mlkctxt is present at the system
if command -v mlkctxt &> /dev/null ; then

  if ! mlkctxt -c $MATCH_MLKCTXT ; then exit 1 ; fi

fi

# Manage identifier
if [ ! -z "${ID_ROOT}" ] ; then

  N="${ID_ROOT}_$(mlkctxt)"
  CONTAINER_HOST_NAME_F="--hostname ${N}"

  if [ "${UNIQUE}" = false ] ; then

    CONTAINER_NAME_F="--name ${N}_$(uuidgen)"

  else

    CONTAINER_NAME_F="--name ${N}"

  fi

fi

# Default X11
X11_F=

# X11 for Mac
if [ "${X11}" == "MAC" ] ; then

  X11_F="-e DISPLAY=host.docker.internal:0"

  # Prepare XQuartz server
  xhost + 127.0.0.1

fi

# X11 for Linux
if [ "$X11" = "LINUX" ] ; then

  # Prepare X11 server
  xhost +
  X11_F="-e DISPLAY=$DISPLAY -v /tmp/.X11-unix:/tmp/.X11-unix -v $HOME/.Xauthority:/root/.Xauthority:rw"

fi

# Env vars
ENV_VARS_F=

if [ ! -z "${ENV_VARS}" ] ; then

  for E in "${ENV_VARS[@]}" ; do

    ARR_E=(${E//=/ })

    ENV_VARS_F="${ENV_VARS_F} -e ${ARR_E[0]}=${ARR_E[1]} "

  done

fi

# Volumes
VOLUMES_F=

if [ ! -z "${VOLUMES}" ] ; then

  for E in "${VOLUMES[@]}" ; do

    VOLUMES_F="${VOLUMES_F} -v ${E} "

  done

fi

# Ports
PORTS_F=

if [ ! -z "${PORTS}" ] ; then

  for E in "${PORTS[@]}" ; do

    PORTS_F="${PORTS_F} -p ${E} "

  done

fi

# Workdir
WORKDIR_F="--workdir /"
if [ ! -z "${WORKDIR}" ] ; then WORKDIR_F="--workdir ${WORKDIR}" ; fi

# Network
if [ ! -z "${NETWORK}" ]; then NETWORK="--network=${NETWORK}" ; fi

# Entrypoint
ENTRYPOINT_F=

if [ ! -z "${ENTRYPOINT}" ] ; then

  ENTRYPOINT_F="--entrypoint ${ENTRYPOINT}"

fi

# Image tag
IMAGE_TAG_F=latest
if [ ! -z "${IMAGE_TAG}" ] ; then IMAGE_TAG_F=$IMAGE_TAG ; fi

# Run mode
if [ ! -z "$RUN_MODE" ] ; then

  if [ "$RUN_MODE" = "PERSISTABLE" ] ; then

    COMMAND_DOCKER="docker run -ti"

  elif [ "$RUN_MODE" = "VOLATILE" ] ; then

    COMMAND_DOCKER="docker run -ti --rm"

  elif [ "$RUN_MODE" = "DAEMON" ] ; then

    COMMAND_DOCKER="docker run -d"

  else

    echo Error: unrecognized RUN_MODE $RUN_MODE, exiting...
    exit 1

  fi

else

  COMMAND_DOCKER="docker run -ti --rm"

fi

# Iterate to produce replicas if VOLATILE is false
if [ ! -z "$REPLICAS" ] ; then

  if [ "$RUN_MODE" = "VOLATILE" ] ; then

    echo VOLATILE and REPLICAS are incompatible options

    exit 1

  fi

  if [ -z "$ID_ROOT" ] ; then

    echo Blank ID_ROOT and REPLICAS are incompatible options

    exit 1

  fi

  for REPLICA in $(seq 1 $REPLICAS) ; do

    REP="$(($REPLICA-1))"

    eval  $COMMAND_DOCKER \
            -e "COMMAND=\"${COMMAND}\"" \
            -e "PYTHONGROUPID=${PYTHONGROUPID}" \
            -e "PYTHONUSERID=${PYTHONUSERID}" \
            $NETWORK \
            ${CONTAINER_NAME_F}_${REP} \
            ${CONTAINER_HOST_NAME_F}_${REP} \
            $VOLUMES_F \
            $ENV_VARS_F \
            $PORTS_F \
            $ENTRYPOINT_F \
            $WORKDIR_F \
            malkab/python:$IMAGE_TAG_F \
            $ENTRYPOINT_COMMAND

  done

else

  eval  $COMMAND_DOCKER \
        -e "COMMAND=\"${COMMAND}\"" \
        -e "PYTHONGROUPID=${PYTHONGROUPID}" \
        -e "PYTHONUSERID=${PYTHONUSERID}" \
        $NETWORK \
        $CONTAINER_NAME_F \
        $CONTAINER_HOST_NAME_F \
        $X11_F \
        $VOLUMES_F \
        $ENV_VARS_F \
        $PORTS_F \
        $ENTRYPOINT_F \
        $WORKDIR_F \
        malkab/python:$IMAGE_TAG_F \
        $ENTRYPOINT_COMMAND

fi
