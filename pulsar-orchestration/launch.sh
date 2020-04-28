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
docker-compose up -d zookeeper-one zookeeper-two zookeeper-three;
sleep 10;
if [ "$ZOOKEEPER_SET" = "no" ]; then
    ./configure_zookeeper.sh;
fi

if [ ! -d "./bookie" ]; then
    mkdir -p bookie/one/data;
    mkdir -p bookie/two/data;
    mkdir -p bookie/three/data;
fi
docker-compose up -d bookie-one bookie-two bookie-three;
sleep 10;

docker-compose up -d broker;