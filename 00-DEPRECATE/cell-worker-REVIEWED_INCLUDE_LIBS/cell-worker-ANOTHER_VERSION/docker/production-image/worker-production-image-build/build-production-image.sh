#!/bin/bash

. ../env

# Creates the production image

# Configure Dockerfile

sed \
    -e "s/##VERSION##/${VERSION}/g" \
    -e "s/##NODEVERSION##/${NODEVERSION}/g" \
    Dockerfile.template > Dockerfile


# Create the dist
docker run --rm -ti \
    --name cell-worker-webpack-bundling \
    -v `pwd`/../../../node/:/ext-src/ \
    --workdir /ext-src/ \
    --entrypoint /bin/bash \
    malkab/nodejs-dev:v10.9.0 \
    -c "npm install && npm run production"


# Copy to Docker build context

mkdir -p assets
cp ../../../node/dist/main.js ./assets/
cp ../../../node/package.json ./assets/
cp ../../../node/package-lock.json ./assets/


# Builds the production application image
docker build -t $WORKERIMAGENAME:$APPVERSION .

docker tag $WORKERIMAGENAME:$APPVERSION $WORKERIMAGENAME:latest


# Clean up
rm -Rf ./assets


# Upload to GitLab
docker login registry.gitlab.com

docker push $WORKERIMAGENAME:$APPVERSION
docker push $WORKERIMAGENAME:latest