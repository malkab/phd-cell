#!/bin/bash

# Creates the production image

# --------------------
# Variable translations in production config
# --------------------
cd ../../../node/src/app/config

# Backup current config
mv config.ts config-current.ts

# Variable substitution
sed \
    -e "s/##VERSION##/${VERSION}/g" \
    config.production.ts > config.ts

# Create the dist
cd ../../../../docker/production-image/app-production-image-build

docker run --rm -ti \
    --name boilerplate-webpack-testing-dist-creation \
    -v `pwd`/../../../node/:/ext-src/ \
    --workdir /ext-src/ \
    --entrypoint /bin/bash \
    malkab/nodejs-dev:v$NODEVERSION \
    -c "npm install && npm run production-build"

# Restore old config
cd ../../../node/src/app/config

mv config-current.ts config.ts

cd ../../../../docker/production-image/app-production-image-build


# Copy to Docker build context

mkdir -p assets
cp -R ../../../node/dist-production/* ./assets/


# Builds the production application image
docker build -t $IMAGENAME:$APPVERSION .

docker tag $IMAGENAME:$APPVERSION $IMAGENAME:latest


# Clean up
rm -Rf ./assets


# Upload to GitLab
docker login registry.gitlab.com -u $GITLAB_USERNAME -p $GITLAB_REGISTRY_TOKEN

docker push $IMAGENAME:$APPVERSION
docker push $IMAGENAME:latest