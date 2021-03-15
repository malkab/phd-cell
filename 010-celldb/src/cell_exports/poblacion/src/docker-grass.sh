#!/bin/bash

# Version 2021-03-03

# -----------------------------------------------------------------
#
# Document here the purpose of the script.
#
# -----------------------------------------------------------------
#
# Runs a GRASS container full of GIS and Python stuff.
#
# -----------------------------------------------------------------
# Check mlkcontext to check. If void, no check will be performed. If NOTNULL,
# any activated context will do, but will fail if no context was activated.
MATCH_MLKCONTEXT=NOTNULL
# Custom command or path to script (relative to WORKDIR) to execute, for example
# "ls -lh". Leave blank for using the image's built-in option.
COMMAND_EXEC=
# The network to connect to. Remember that when attaching to the network of an
# existing container (using container:name) the HOST is "localhost". Also the
# host network can be connected using just "host".
NETWORK=
# Container identifier root. This is used for both the container name (adding an
# UID to avoid clashing) and the container host name (without UID). Incompatible
# with NETWORK container:name option. If blank, a Docker engine default name
# will be assigned to the container.
ID_ROOT=cell_exports
# Unique? If true, no container with the same name can be created. Defaults to
# true.
UNIQUE=true
# Work dir. Use $(pwd) paths. Defaults to /.
WORKDIR=$(pwd)/container_scripts
# Run mode. Can be PERSISTABLE (-ti), VOLATILE (-ti --rm), or DAEMON (-d). If
# blank, defaults to VOLATILE.
RUN_MODE=
# The name of the image to pull, without tag. Defaults to malkab/grass.
IMAGE_NAME=
# The GRASS Docker image tag to use. Defaults to latest.
IMAGE_TAG=
# Declare volumes, a line per volume, complete in source:destination form. No
# strings needed, $(pwd)/../data/:/ext_src/ works perfectly. Defaults to ().
VOLUMES=($(pwd)/../../:$(pwd)/../../)
# Env vars. Use ENV_VAR_NAME_CONTAINER=ENV_VAR_NAME_HOST format. Defaults to ().
ENV_VARS=(
  MLKC_CELL_DB_HOST=$MLKC_CELL_DB_HOST
  MLKC_SYSTEM_KEPLER_PG_USER_CELL_MASTER=$MLKC_SYSTEM_KEPLER_PG_USER_CELL_MASTER
  MLKC_SYSTEM_KEPLER_PG_PASS_CELL_MASTER=$MLKC_SYSTEM_KEPLER_PG_PASS_CELL_MASTER
  MLKC_SYSTEM_KEPLER_PG_PORT=$MLKC_SYSTEM_KEPLER_PG_PORT
)
# Replicas. If VOLATILE is true will fail. Keep in mind replicas will share
# volumes and all other configuration set. They'll be named with a -# suffix.
# Keep blank for no replicas.
REPLICAS=
# Open ports in the form (external:internal external:internal).
PORTS=
# Custom entrypoint, leave blank for using the image's built-in option.
ENTRYPOINT=
# The following options are mutually exclusive. Use display for X11 host server
# in Mac? Defaults to false.
X11_MAC=
# Use display for X11 host server in Linux? Defaults to false.
X11_LINUX=
# PostgreSQL user UID and GID. Defaults to 1000 and 1000.
POSTGRESUSERID=0
POSTGRESGROUPID=0





# ---

# Check mlkcontext is present at the system
if command -v mlkcontext &> /dev/null ; then

  if ! mlkcontext -c $MATCH_MLKCONTEXT ; then exit 1 ; fi

fi

# Manage identifier
if [ ! -z "${ID_ROOT}" ] ; then

  N="${ID_ROOT}_$(mlkcontext)"
  CONTAINER_HOST_NAME_F="--hostname ${N}"

  if [ "${UNIQUE}" = false ] ; then

    CONTAINER_NAME_F="--name ${N}_$(uuidgen)"

  else

    CONTAINER_NAME_F="--name ${N}"

  fi

fi

# Network
if [ ! -z "${NETWORK}" ]; then NETWORK="--network=${NETWORK}" ; fi

# Env vars
ENV_VARS_F=

if [ ! -z "${ENV_VARS}" ] ; then

  for E in "${ENV_VARS[@]}" ; do

    ARR_E=(${E//=/ })

    ENV_VARS_F="${ENV_VARS_F} -e ${ARR_E[0]}=${ARR_E[1]} "

  done

fi

# Image name
IMAGE_NAME_F=malkab/grass
if [ ! -z "${IMAGE_NAME}" ]; then IMAGE_NAME_F=$IMAGE_NAME ; fi

# Image tag
IMAGE_TAG_F=latest
if [ ! -z "${IMAGE_TAG}" ] ; then IMAGE_TAG_F=$IMAGE_TAG ; fi

# Command, if any
if [ ! -z "${COMMAND_EXEC}" ] ; then COMMAND_EXEC="-c \"${COMMAND_EXEC}\"" ; fi

# Default X11
X11_F=

# X11 for Mac
if [ "${X11_MAC}" = true ] ; then

  X11_F="-e DISPLAY=host.docker.internal:0"

  # Prepare XQuartz server
  xhost + 127.0.0.1

fi

# X11 for Linux
if [ "${X11_LINUX}" = true ] ; then

  # This is for newer Ubuntus
  X11_F="-e DISPLAY -v $XAUTHORITY:/root/.Xauthority:rw"
  # This is for older Ubuntus
  # X11="-e DISPLAY -v $HOME/.Xauthority:/root/.Xauthority:rw"

fi

# Workdir
WORKDIR_F="--workdir /"
if [ ! -z "${WORKDIR}" ] ; then WORKDIR_F="--workdir ${WORKDIR}" ; fi

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

fi

# UID
POSTGRESUSERID_F=1000
if [ ! -z "${POSTGRESUSERID}" ] ; then POSTGRESUSERID_F=$POSTGRESUSERID ; fi

# GID
POSTGRESGROUPID_F=1000
if [ ! -z "${POSTGRESGROUPID}" ] ; then POSTGRESGROUPID_F=$POSTGRESGROUPID ; fi

# Iterate to produce replicas if VOLATILE is false
if [ ! -z "$REPLICAS" ] ; then

  if [ "$VOLATILE" = true ] ; then

    echo VOLATILE true and REPLICAS not blank are incompatible options

    exit 1

  fi

  for REPLICA in $(seq 1 $REPLICAS) ; do

    eval  $COMMAND \
            $NETWORK \
            ${CONTAINER_NAME_F}-${REPLICA} \
            ${CONTAINER_HOST_NAME_F}-${REPLICA} \
            $VOLUMES_F \
            $PORTS_F \
            -u $POSTGRESUSERID_F:$POSTGRESGROUPID_F \
            $ENTRYPOINT \
            $WORKDIR_F \
            $ENV_VARS_F \
            $IMAGE_NAME_F:$IMAGE_TAG_F \
            $COMMAND_EXEC

  done

else

  eval  $COMMAND \
          $NETWORK \
          $CONTAINER_NAME_F \
          $CONTAINER_HOST_NAME_F \
          $X11_F \
          $VOLUMES_F \
          $PORTS_F \
          -u $POSTGRESUSERID_F:$POSTGRESGROUPID_F \
          $ENTRYPOINT \
          $WORKDIR_F \
          $ENV_VARS_F \
          $IMAGE_NAME_F:$IMAGE_TAG_F \
          $COMMAND_EXEC

fi
