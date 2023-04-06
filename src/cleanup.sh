#!/bin/bash

docker-compose down
docker rm -f $(docker ps -a -q)