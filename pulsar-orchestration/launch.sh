ZOOKEEPER_SET="yes"
if [ ! -d "./zookeeper" ]; then
    ZOOKEEPER_SET="no"
    mkdir -p zookeeper/one/data;
    mkdir -p zookeeper/one/datalog;
    mkdir -p zookeeper/two/data;
    mkdir -p zookeeper/two/datalog;
    mkdir -p zookeeper/three/data;
    mkdir -p zookeeper/three/datalog;
fi
docker-compose up -d
if [ "$ZOOKEEPER_SET" = "no" ]; then
    sleep 10;
    ./configure_zookeeper.sh;
fi