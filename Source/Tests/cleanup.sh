#!/bin/bash
docker kill $(docker ps -q)
docker network prune -f
docker volume rm $(docker volume ls -qf dangling=true)
rm -rf tt
mkdir tt