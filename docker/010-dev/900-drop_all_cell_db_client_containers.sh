#!/bin/bash

# Drops all containers that are clients to the Cell DB
docker stop -t0 pg_sql_cell_db
docker stop -t0 libcellbackend-cell-psql

SELECT pg_terminate_backend(pid)
 FROM pg_stat_get_activity(NULL::integer)
 WHERE datid=(SELECT oid from pg_database where datname = 'your_database');
