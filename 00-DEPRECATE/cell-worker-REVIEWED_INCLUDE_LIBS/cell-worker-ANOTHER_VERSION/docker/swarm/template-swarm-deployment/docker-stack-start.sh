#!/bin/bash

# Stack deployment

docker login registry.gitlab.com

docker stack deploy -c docker-compose.yaml cellworker --with-registry-auth
