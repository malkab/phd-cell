#!/bin/bash

# Drop stopped container
docker container rm $(docker container ls -aq)

# Drops dangling images
docker rmi $(docker images -qf dangling=true)
