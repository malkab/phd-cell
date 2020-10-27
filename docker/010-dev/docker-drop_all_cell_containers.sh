#!/bin/bash

# Drops all containers for the full backend, usefull when exiting tmuxinator
# full-backend profile unclean
docker stop $(docker ps -aqf name=cell-*)
docker rm cell-postgis
docker rm cell-redis
docker rm cell-cell_raw_data_postgis_dev
