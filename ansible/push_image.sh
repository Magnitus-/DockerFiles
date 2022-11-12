export IMAGE_REPO=$(cat ./info.json | jq -r ".image_repo")
export VERSION=$(cat ./info.json | jq -r ".version")
export IMAGE=$IMAGE_REPO:$VERSION

docker build -t $IMAGE .

docker push $IMAGE