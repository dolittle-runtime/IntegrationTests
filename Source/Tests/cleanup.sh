#!/bin/bash
docker kill $(docker ps -q)
docker network prune -f
rm -rf tt
mkdir tt