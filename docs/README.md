# Troubleshooting notes

A dump of some common issues

## How to fix docker networking issue / rebuild bridge

pkill docker

iptables -t nat -F

ifconfig docker0 down

brctl delbr docker0

docker -d

check /etc/docker/daemon.json for dns entries

## Building docker image with proxy

docker build --build-arg HTTP_PROXY=$HTTP_PROXY --build-arg HTTPS_PROXY=$HTTPS_PROXY --no-cache -t nocoat .

## Running docker image with proxy

docker run -p 8000:8000 -p 9229:9229 -e HTTP_PROXY=$HTTP_PROXY -e HTTPS_PROXY=$HTTPS_PROXY nocoat

## Deploying the app

gcloud app deploy

## Viewing logs files

gcloud app logs tail -s default
