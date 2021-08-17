#!/bin/bash

# Version 2021-01-26

# -----------------------------------------------------------------
#
# Remote dump of cell database.
#
# -----------------------------------------------------------------
#
# Creates database backups.
#
# -----------------------------------------------------------------
# Check mlkctxt to check. If void, no check will be performed. If NOTNULL,
# any activated context will do, but will fail if no context was activated.
MATCH_MLKCTXT=NOTNULL
# Documentation for the backup to be stored in the README.md. Must be quoted.
DOC="Dump of cell database."
# The network to connect to. Remember that when attaching to the network of an
# existing container (using container:name) the HOST is "localhost".
NETWORK=
# The DB to dump.
DB=cell
# Dump name suffix. It will prefixed by the name of the database and the
# timestamp.
DUMP_SUFFIX=cell_db
# Tables to dump, if any, like in (schema.table0 schema.table1 "schema.\"bad
# name\"").
TABLES=
# Schemas to dump, if any, like in (schema0 schema1 "\"schema bad name\"").
SCHEMAS=
# The folder to leave the dump.
BACKUPS_FOLDER=$(pwd)/backups
# Encoding.
ENCODING=UTF8
# Container name.
CONTAINER_NAME=db_backup
# The version of Docker PG image to use.
POSTGIS_DOCKER_TAG=gargantuan_giraffe
# The host.
HOST=37north.io
# The port.
PORT=5632
# The user.
USER=cell_master
# The pass.
PASS=38fn3k39erj34n8
# Dump format (p plain text, c custom, d directory, t tar).
FORMAT=c
# Verbose.
VERBOSE=true
# Compression level.
ZLEVEL=9





# ---

# Check mlkctxt is present at the system
if command -v mlkctxt &> /dev/null ; then

  if ! mlkctxt -c $MATCH_MLKCTXT ; then exit 1 ; fi

fi


# Create the backup folder
mkdir -p $BACKUPS_FOLDER

# Verbosiness
if [ "$VERBOSE" = true ] ; then VERBOSE="-v" ; else VERBOSE="" ; fi

# Network
if [ ! -z "${NETWORK}" ] ; then NETWORK="--network=${NETWORK}" ; fi

# Container name
if [ ! -z "${CONTAINER_NAME}" ] ; then

  CONTAINER_NAME="--name=${CONTAINER_NAME}_$(uuidgen)"

fi

# Dump name
DUMP_NAME=$(date '+%Y%m%d_%H%M%S')_$DB_$DUMP_SUFFIX

# Dump command processing, mandatory options
DUMP_COMMAND="PGPASSWORD=${PASS} pg_dump -b -F ${FORMAT} ${VERBOSE} \
  -Z ${ZLEVEL} -E ${ENCODING} -f ${DUMP_NAME} \
  -h ${HOST} -p ${PORT} -U ${USER}"

# Add tables and/or schemas, if any
if [ ! -z "${TABLES}" ] ; then

  for TABLE in "${TABLES[@]}" ; do

    DUMP_COMMAND="${DUMP_COMMAND} -t ${TABLE} "

  done

fi

if [ ! -z "${SCHEMAS}" ] ; then

  for SCHEMA in "${SCHEMAS[@]}" ; do

    DUMP_COMMAND="${DUMP_COMMAND} -n ${SCHEMA} "

  done

fi

# Write documentation, if any
if [ ! -z "${DOC}" ] ; then

  echo "$DOC" > $BACKUPS_FOLDER/${DUMP_NAME}_README.md

fi

# Final command run
DUMP_COMMAND="${DUMP_COMMAND} ${DB}"

eval    docker run -ti --rm \
          $NETWORK \
          $CONTAINER_NAME \
          $CONTAINER_HOST_NAME \
          -v $BACKUPS_FOLDER:/ext_src/ \
          --entrypoint /bin/bash \
          --workdir /ext_src/ \
          malkab/postgis:$POSTGIS_DOCKER_TAG \
          -c \"${DUMP_COMMAND}\"
