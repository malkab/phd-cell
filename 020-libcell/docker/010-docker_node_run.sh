#!/bin/bash

# Version: 2020-10-11

# -----------------------------------------------------------------
#
# Document here the purpose of the script.
#
# -----------------------------------------------------------------
#
# Runs Node environment. Good for interactive use for data science or Node /
# Express programs, and also for Angular frontend development.
#
# -----------------------------------------------------------------

# Check mlk-context to check. If void, no check will be performed.
MATCH_MLKCONTEXT=common
# Node image version.
NODE_VERSION=12.16.3
# Env mode: production / development.
NODE_ENV=development
# Node memory.
NODE_MEMORY=8GB
# Null for an interactive shell session, the EXEC is passed to /bin/bash with
# the -c option. Can be used to run Node scripts with "node whatever" or run npm
# targets with "npm run whatever".
EXEC=
# The network to connect to. Remember that when attaching to the network of an
# existing container (using container:name) the HOST is "localhost".
NETWORK=$MLKC_CELL_NETWORK
# Jupyter mode: runs a Jupyter server with Javascript support if a version with
# this capability is used. Jupyter exports automatically the 8888 port.
JUPYTER=false
# Container name.
CONTAINER_NAME=libcellbackend_dev
# Container host name. Incompatible with NETWORK=container:XXX.
CONTAINER_HOST_NAME=libcellbackend_dev
# A set of volumes in the form ("source:destination" "source:destination"). Most
# of the times the src folder of the Node source code base is replicated inside
# the container with the same path so build systems works as expected (see
# second line as example). Also this tend to be the WORKDIR As default, the user
# local .npmrc is also included as a volume, so login permissions to private
# repos are shared with the container.
VOLUMES=(
  $(pwd)/../../../:$(pwd)/../../../
  ~/.npmrc:/root/.npmrc
  ~/.npmrc:/home/node/.npmrc
)
# Volatile (-ti --rm).
VOLATILE=true
# Open ports in the form (external:internal external:internal). Ports 9229 and
# 9329 are typically container-level assigned port for remote debuggers. Port
# 8080 is typically assigned at container-level to an Express app entrypoint.
# Angular applications traditionally export port 4200. Incompatible with
# NETWORK=container:XXX.
PORTS=()
# Custom entrypoint.
ENTRYPOINT=/bin/bash
# Custom workdir.
WORKDIR=$(pwd)/../node/
# Use display for X11 host server?
X11=false





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

if [ ! -z "${EXEC}" ]; then COMMAND="-c \"${EXEC}\"" ; fi

if [ ! -z "${NETWORK}" ] ; then

  NETWORK="--network=${NETWORK}"

fi

if [ "${X11}" = true ] ; then

  X11="-e DISPLAY=host.docker.internal:0"

  # Prepare XQuartz server
  xhost + 127.0.0.1

else

  X11=

fi

if [ ! -z "${CONTAINER_NAME}" ] ; then

  CONTAINER_NAME="--name=${CONTAINER_NAME}"

fi

if [ ! -z "${CONTAINER_HOST_NAME}" ] ; then

  CONTAINER_HOST_NAME="--hostname=${CONTAINER_HOST_NAME}"

fi

if [ ! -z "${ENTRYPOINT}" ] ; then

  ENTRYPOINT="--entrypoint ${ENTRYPOINT}"

fi

if [ ! -z "${WORKDIR}" ] ; then

  WORKDIR="--workdir ${WORKDIR}"

fi

VOLUMES_F=

if [ ! -z "${VOLUMES}" ] ; then

  for E in "${VOLUMES[@]}" ; do

    VOLUMES_F="${VOLUMES_F} -v ${E} "

  done

fi

PORTS_F=

if [ ! -z "${PORTS}" ] ; then

  for E in "${PORTS[@]}" ; do

    PORTS_F="${PORTS_F} -p ${E} "

  done

fi

if [ "$JUPYTER" = true ] ; then

  COMMAND="-c \"jupyter notebook --ip 0.0.0.0 --allow-root\""
  PORTS_F="${PORTS_F} -p 8888:8888 "

fi

if [ "$VOLATILE" = true ] ; then

  DOCKER_COMMAND="docker run -ti --rm"

else

  DOCKER_COMMAND="docker run -ti"

fi

eval  $DOCKER_COMMAND \
        -e "NODE_ENV=${NODE_ENV}" \
        -e "NODE_MEMORY=${NODE_MEMORY}" \
        $NETWORK \
        $CONTAINER_NAME \
        $CONTAINER_HOST_NAME \
        $X11 \
        $VOLUMES_F \
        $PORTS_F \
        $ENTRYPOINT \
        $WORKDIR \
        malkab/nodejs-dev:$NODE_VERSION \
        $COMMAND
