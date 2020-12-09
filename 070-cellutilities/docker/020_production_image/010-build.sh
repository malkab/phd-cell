#!/bin/bash

# Version 2020-10-13

# -----------------------------------------------------------------
#
# Builds and packs the API.
#
# -----------------------------------------------------------------
#
# Builds a Node application Docker image.
#
# -----------------------------------------------------------------

# Check mlkcontext to check. If void, no check will be performed.
MATCH_MLKCONTEXT=production_image
# The name of the image to push.
IMAGE_NAME=$MLKC_SUNNSAAS_DOCKER_PRODUCTION_API
# The tag.
IMAGE_TAG=$MLKC_SUNNSAAS_VERSION
# Dockerfile.
DOCKERFILE=.
# Latest? Tag the image as latest, too.
LATEST=true
# Node memory for building.
NODE_MEMORY=$MLKC_SUNNSAAS_NODE_MEMORY
# Node version.
NODE_VERSION=$MLKC_SUNNSAAS_NODE_VERSION
# App name without the scope.
APP_NAME=sunnsaas_v1-api
# Node source folder (package.json location).
SOURCE_CODE_FOLDER=$(pwd)/../../../010_api/node/




# ---

echo -------------
echo WORKING AT $(mlkcontext)
echo -------------

# Check mlkcontext
if [ ! -z "${MATCH_MLKCONTEXT}" ] ; then

  if [ ! "$(mlkcontext)" = "$MATCH_MLKCONTEXT" ] ; then

    echo Please initialise context $MATCH_MLKCONTEXT

    exit 1

  fi

fi

# Create the build folder
rm -Rf ./build-dist
mkdir ./build-dist

# Move the Dockerfile to build-dist
cp Dockerfile build-dist

# Builds the app
docker run -ti --rm \
    -v $SOURCE_CODE_FOLDER:$SOURCE_CODE_FOLDER \
    -v $(pwd)/build-dist/:/build-dist/ \
    -v ~/.npmrc:/root/.npmrc:ro \
    -e NODE_OPTIONS=--max_old_space_size=$NODE_MEMORY \
    -e NODE_ENV="production" \
    --workdir $SOURCE_CODE_FOLDER \
    --entrypoint /bin/bash \
    malkab/nodejs-dev:$NODE_VERSION \
    -c "yarn build"

# Move the node-pack from the source code
cp -R $SOURCE_CODE_FOLDER/dist ./build-dist/

cd ./build-dist

# Build
docker build -t $IMAGE_NAME:$IMAGE_TAG \
  --build-arg ARG_APP_NAME=$APP_NAME \
  $DOCKERFILE

# Tag latest, if asked
if [ "${LATEST}" = true ] ; then

  docker build -t $IMAGE_NAME:latest \
    --build-arg ARG_APP_NAME=$APP_NAME \
    $DOCKERFILE

fi

cd ..
