#!/bin/bash

# ---------------------------
#
# Common settings for all contexts.
#
# ---------------------------
#
# Prefix variables with MLKC_.
#
# ---------------------------

# -----
# PostGIS for Cell DB
# -----
export MLKC_CELL_DB_NETWORK=
export MLKC_CELL_DB_HOST=$MLKC_SYSTEM_37NORTH_HOST
export MLKC_CELL_DB_USER=$MLKC_SYSTEM_37NORTH_PG_USER
export MLKC_CELL_DB_PORT=$MLKC_SYSTEM_37NORTH_PG_PORT
export MLKC_CELL_DB_PASS=$MLKC_SYSTEM_37NORTH_PG_PASS
export MLKC_CELL_DB_DB=cell

# -----
# PostGIS for cell_raw_data
# -----
export MLKC_CELL_RAW_DATA_NETWORK=
export MLKC_CELL_RAW_DATA_HOST=$MLKC_SYSTEM_37NORTH_HOST
export MLKC_CELL_RAW_DATA_USER=$MLKC_SYSTEM_37NORTH_PG_USER
export MLKC_CELL_RAW_DATA_PORT=$MLKC_SYSTEM_37NORTH_PG_PORT
export MLKC_CELL_RAW_DATA_PASS=$MLKC_SYSTEM_37NORTH_PG_PASS
export MLKC_CELL_RAW_DATA_DB=cell_raw_data
