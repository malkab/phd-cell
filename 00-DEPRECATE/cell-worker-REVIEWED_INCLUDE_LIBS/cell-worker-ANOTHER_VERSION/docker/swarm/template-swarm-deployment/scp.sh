#!/bin/bash

# scp info for deployment at kepler

HOST=user@host

scp -r ./* $HOST:/home/docker/cell-worker
