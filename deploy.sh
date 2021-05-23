#!/bin/bash

cd maskr

echo "INFO   Stop docker services"
docker-compose -f prod.yaml down

echo "INFO   Pulling latest branch"
git reset --hard
git checkout master
git pull

echo "INFO   Loading secrets/configuration"
cp ~/secrets/config.js server/config/

echo "INFO   Building frontend"
cd client
npm install
npm run build
cd ..

echo "INFO   Starting docker services"
# FIXME  Building in prod takes long for some reason, even w/ .dockerignore...
#        Installing server packages by hand should workaround this
# docker-compose -f prod.yaml up --build -d
cd server
npm install
cd ..
docker-compose -f prod.yaml up -d

cd ..
