#!/bin/bash

# Exports a PG table to a GeoPackage

PGCLIENTENCODING=UTF-8 ogr2ogr \
  -f GPKG ../../data/900_out/poblacion.gpkg \
  PG:"host=${MLKC_CELL_DB_HOST} user=${MLKC_SYSTEM_KEPLER_PG_USER_CELL_MASTER} dbname=cell password=${MLKC_SYSTEM_KEPLER_PG_PASS_CELL_MASTER} port=${MLKC_SYSTEM_KEPLER_PG_PORT}" \
	"export.poblacion" \
  -a_srs EPSG:4326
