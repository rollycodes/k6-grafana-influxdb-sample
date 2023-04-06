#! /bin/bash

docker-compose down
docker rm -f $(docker ps -a -q)
docker-compose up -d influxdb grafana
docker-compose run k6 run /scripts/sample-load.js