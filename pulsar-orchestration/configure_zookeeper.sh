docker run --rm \
           --network zookeeper \
           --entrypoint="" \
           apachepulsar/pulsar:2.5.1 bin/pulsar initialize-cluster-metadata \
           --cluster pulsar-cluster-1 \
           --zookeeper zookeeper-one:2181 \
           --configuration-store zookeeper-one:2181 \
           --web-service-url http://pulsar-broker:8080 \
           --web-service-url-tls https://pulsar-broker:8443 \
           --broker-service-url pulsar://pulsar-broker:6650 \
           --broker-service-url-tls pulsar+ssl://pulsar-broker:6651