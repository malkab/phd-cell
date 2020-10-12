#!/bin/bash

# Check worker's log

docker service logs --tail 1000 cellworker_worker
