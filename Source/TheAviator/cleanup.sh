#!/bin/bash
docker kill $(docker ps -q)
docker rm $(docker ps -qa)
docker network prune -f
docker volume rm $(docker volume ls -qf dangling=true)
rm -rf resultOutput