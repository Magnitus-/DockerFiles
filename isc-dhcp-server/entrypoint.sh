#!/usr/bin/env bash

cp $SOURCE_CONF_PATH $CONF_PATH;
touch $LEASE_PATH;

chown $RUNTIME_USER:$RUNTIME_USER $CONF_PATH;
chown $RUNTIME_USER:$RUNTIME_USER $LEASE_PATH;

exec /usr/sbin/dhcpd -$IP_VERSION -d -f --no-pid -user $RUNTIME_USER -group $RUNTIME_USER -cf $CONF_PATH -lf $LEASE_PATH $INTERFACE