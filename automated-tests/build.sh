docker build -t magnitus/automated-tests:node-0.10-base -f node-0.10-base.df .;
docker build -t magnitus/automated-tests:node-4.1-base -f node-4.1-base.df .;
for dir in */ ; do
    (cd "$dir"; ./build.sh);
done
