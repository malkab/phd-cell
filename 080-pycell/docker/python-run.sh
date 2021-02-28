#!/bin/bash

# Version: 2021-02-28

# -----------------------------------------------------------------
#
# Document here the purpose of the script.
#
# -----------------------------------------------------------------
#
# Runs a Python environment.
#
# -----------------------------------------------------------------
# Check mlkcontext to check. If void, no check will be performed. If NOTNULL,
# any activated context will do, but will fail if no context was activated.
MATCH_MLKCONTEXT=common
# Custom quoted command or path to script (relative to WORKDIR) to execute, for
# example "python whatever". Leave blank for an interactive session.
COMMAND_EXEC=
# The network to connect to. Remember that when attaching to the network of an
# existing container (using container:name) the HOST is "localhost".
NETWORK=
# Container identifier root. This is used for both the container name (adding an
# UID to avoid clashing) and the container host name (without UID). Incompatible
# with NETWORK container:name option. If blank, a Docker engine default name
# will be assigned to the container.
ID_ROOT=pycell
# Unique? If true, no container with the same name can be created. Defaults to
# true.
UNIQUE=
# The Python image tag. Defaults to "latest".
IMAGE_TAG=
# A set of volumes in the form ("source:destination" "source:destination").
VOLUMES=(
  $(pwd)/../:$(pwd)/../
)
# Env vars. Use ENV_VAR_NAME_CONTAINER=ENV_VAR_NAME_HOST format.
ENV_VARS=()
# Run mode. Can be PERSISTABLE (-ti), VOLATILE (-ti --rm), or DAEMON (-d). If
# blank, defaults to VOLATILE.
RUN_MODE=
# Replicas. If RUN_MODE is VOLATILE will fail. Keep in mind replicas will share
# volumes and all other configuration set. They'll be named with a -# suffix.
# Keep blank for no replicas.
REPLICAS=
# Open ports in the form (external:internal external:internal).
PORTS=()
# Custom entrypoint, leave blank for using the image's built-in option.
ENTRYPOINT=
# Custom workdir. Defaults to /.
WORKDIR=$(pwd)/../
# Use display for X11 host server in MAC, LINUX, or NONE. Defaults to NONE.
X11=



# ---

# Check mlkcontext is present at the system
if command -v mlkcontext &> /dev/null ; then

  if ! mlkcontext -c $MATCH_MLKCONTEXT ; then exit 1 ; fi

fi

# Manage identifier
if [ ! -z "${ID_ROOT}" ] ; then

  CONTAINER_HOST_NAME="${ID_ROOT}_${MATCH_MLKCONTEXT}"

  if [ "${UNIQUE}" = false ] ; then

    CONTAINER_NAME="${CONTAINER_HOST_NAME}_$(uuidgen)"

  else

    CONTAINER_NAME="${CONTAINER_HOST_NAME}"

  fi

fi

# Command, if any
if [ ! -z "${COMMAND_EXEC}" ] ; then

  COMMAND_EXEC="-c \"${COMMAND_EXEC}\""

fi

# Network, if any
if [ ! -z "${NETWORK}" ] ; then

  NETWORK="--network=${NETWORK}"

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

# Container name
if [ ! -z "${CONTAINER_NAME}" ] ; then

  CONTAINER_NAME="--name=${CONTAINER_NAME}"

fi

# Container host name
if [ ! -z "${CONTAINER_HOST_NAME}" ] ; then

  CONTAINER_HOST_NAME="--hostname=${CONTAINER_HOST_NAME}"

fi

# Entrypoint
if [ ! -z "${ENTRYPOINT}" ] ; then

  ENTRYPOINT="--entrypoint ${ENTRYPOINT}"

fi

# Workdir
if [ ! -z "${WORKDIR}" ] ; then

  WORKDIR="--workdir ${WORKDIR}"

fi

# Volumes
VOLUMES_F=

if [ ! -z "${VOLUMES}" ] ; then

  for E in "${VOLUMES[@]}" ; do

    VOLUMES_F="${VOLUMES_F} -v ${E} "

  done

fi

# Env vars
ENV_VARS_F=

if [ ! -z "${ENV_VARS}" ] ; then

  for E in "${ENV_VARS[@]}" ; do

    ARR_E=(${E//=/ })

    ENV_VARS_F="${ENV_VARS_F} -e ${ARR_E[0]}=${ARR_E[1]} "

  done

fi

# Ports
PORTS_F=

if [ ! -z "${PORTS}" ] ; then

  for E in "${PORTS[@]}" ; do

    PORTS_F="${PORTS_F} -p ${E} "

  done

fi

# Run mode
if [ ! -z "$RUN_MODE" ] ; then

  if [ "$RUN_MODE" = "PERSISTABLE" ] ; then

    COMMAND="docker run -ti"

  elif [ "$RUN_MODE" = "VOLATILE" ] ; then

    COMMAND="docker run -ti --rm"

  elif [ "$RUN_MODE" = "DAEMON" ] ; then

    COMMAND="docker run -d"

  else

    echo Error: unrecognized RUN_MODE $RUN_MODE, exiting...
    exit 1

  fi

else

  COMMAND="docker run -ti --rm"

  RUN_MODE=VOLATILE

fi

# Get default image tag
if [ -z "$IMAGE_TAG" ] ; then

  IMAGE_TAG=latest

fi

# Iterate to produce replicas if VOLATILE is false
if [ ! -z "$REPLICAS" ] ; then

  if [ "$RUN_MODE" = "VOLATILE" ] ; then

    echo VOLATILE and REPLICAS are incompatible options

    exit 1

  fi

  for REPLICA in $(seq 1 $REPLICAS) ; do

    REP="$(($REPLICA-1))"

    eval  $COMMAND \
            $NETWORK \
            ${CONTAINER_NAME}-${REP} \
            ${CONTAINER_HOST_NAME}-${REP} \
            $X11_F \
            $VOLUMES_F \
            $ENV_VARS_F \
            $PORTS_F \
            $ENTRYPOINT \
            $WORKDIR \
            malkab/python:$IMAGE_TAG \
            $COMMAND_EXEC

  done

else

  eval  $COMMAND \
        $NETWORK \
        ${CONTAINER_NAME} \
        ${CONTAINER_HOST_NAME} \
        $X11_F \
        $VOLUMES_F \
        $ENV_VARS_F \
        $PORTS_F \
        $ENTRYPOINT \
        $WORKDIR \
        malkab/python:$IMAGE_TAG \
        $COMMAND_EXEC

fi
