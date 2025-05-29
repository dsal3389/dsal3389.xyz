#! /bin/bash

IMAGE_NAME="dsal3389.xyz"
CONTAINER_NAME="http"

# build the hugo static files, hugo will
# store those files in the `public` folder by default
hugo build

# delete the currently running docker
# container, because we need to delete the image
# to update it, then delete the docker image
docker rm -f $CONTAINER_NAME && docker rmi $IMAGE_NAME

# rebuild the image so it will contain the new
# generated static files
docker buildx build -t $IMAGE_NAME .

# create the new container
docker run  -d -m 256MB --name $CONTAINER_NAME $IMAGE_NAME
