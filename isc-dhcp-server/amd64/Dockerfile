FROM debian:stretch-slim

RUN apt-get update -y && \
    apt-get install -y isc-dhcp-server && \
    apt-get autoremove -y && \
    apt-get clean -y

ENV RUNTIME_USER=www-data
ENV SOURCE_CONF_PATH=/opt/dhcp/dhcpd.conf
ENV IP_VERSION=4
ENV INTERFACE=eth0

ENV CONF_PATH=/etc/dhcp/dhcp.conf
ENV LEASE_PATH=/var/lib/dhcp/dhcp.lease

COPY entrypoint.sh /opt/entrypoint.sh
RUN chmod +x /opt/entrypoint.sh

CMD ["/opt/entrypoint.sh"]