#!/bin/bash

# Version: 2020-12-10

# -----------------------------------------------------------------
#
# Document here the purpose of the script.
#
# -----------------------------------------------------------------
#
# Cuts all clients to a DB in a PostgreSQL server.
#
# -----------------------------------------------------------------

# Check mlkcontext to check. If void, no check will be performed
MATCH_MLKCONTEXT=
# The network to connect to. Remember that when attaching to the network of an
# existing container (using container:name) the HOST is "localhost". Also the
# host network can be connected using just "host".
NETWORK=$MLKC_CELL_NETWORK
# The host
HOST=$MLKC_CELL_DB_HOST
# The port
PORT=$MLKC_CELL_DB_PORT
# The user
USER=$MLKC_CELL_DB_USER
# The pass
PASS=$MLKC_CELL_DB_PASS
# The DB to cut clients to
DATABASE=cell
# Service database
DB=postgres
# The version of Docker PG image to use
POSTGIS_DOCKER_TAG=gargantuan_giraffe





# ---

# Check mlkcontext is present at the system
if command -v mlkcontext &> /dev/null
then

  echo -------------
  echo WORKING AT $(mlkcontext)

  # Check mlkcontext
  if [ ! -z "${MATCH_MLKCONTEXT}" ] ; then

    if [ ! "$(mlkcontext)" = "$MATCH_MLKCONTEXT" ] ; then

      echo Please initialise context $MATCH_MLKCONTEXT
      exit 1

    fi

  fi

fi

COMMAND="SELECT pg_terminate_backend(pid) FROM pg_stat_get_activity(NULL::integer) WHERE datid=(SELECT oid from pg_database where datname = '${DATABASE}');"

echo -------------
echo DROPPING CONNECTIONS TO ${DATABASE}
echo -------------

if [ ! -z "${NETWORK}" ] ; then NETWORK="--network=${NETWORK}" ; fi

if [ ! -z "${CONTAINER_NAME}" ] ; then

  CONTAINER_NAME="--name=${CONTAINER_NAME}"

fi

if [ ! -z "${CONTAINER_HOST_NAME}" ] ; then

  CONTAINER_HOST_NAME="--hostname=${CONTAINER_HOST_NAME}"

fi

VOLUMES_F=

if [ ! -z "${VOLUMES}" ] ; then

  for E in "${VOLUMES[@]}" ; do

    VOLUMES_F="${VOLUMES_F} -v ${E} "

  done

fi

if [ ! -z "${SCRIPT}" ] ; then

  SCRIPT="-f ${SCRIPT}"

fi

if [ ! -z "${COMMAND}" ] ; then

  COMMAND="-c \\\"${COMMAND}\\\""

fi

if [ ! -z "${WORKDIR}" ] ; then

  WORKDIR="--workdir ${WORKDIR}"

fi

if [ "$OUTPUT_FILES" == "true" ] ; then

  OUTPUT_FILES=" 1>out.txt 2>error.txt"

else

  OUTPUT_FILES=""

fi

eval    docker run -ti --rm \
          $NETWORK \
          $CONTAINER_NAME \
          $CONTAINER_HOST_NAME \
          $VOLUMES_F \
          $WORKDIR \
          --entrypoint /bin/bash \
          malkab/postgis:$POSTGIS_DOCKER_TAG \
          -c "\"PGPASSWORD=${PASS} psql -h ${HOST} -p ${PORT} -U ${USER} ${DB} ${SCRIPT} ${COMMAND} ${OUTPUT_FILES}\""
