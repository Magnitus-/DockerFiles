docker run -d --net none --name user-store-db mongo:3.1;
docker run -it --rm --net container:user-store-db magnitus/automated-tests:4.1-node-user-store;
docker run -it --rm --net container:user-store-db magnitus/automated-tests:0.10-node-user-store;
docker stop user-store-db;
docker rm user-store-db;


