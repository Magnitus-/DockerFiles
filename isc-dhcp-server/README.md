# Overview

This is just a dockerfile to run the isc dhcp server.

Basically, you can plugin your configuration file, start the container on the host network and you should be set.

# Usage

The container can be composed with the following environment variables:

- IP_VERSION: Version of the IP protocol to use (ie, 4 or 6). Note that my use case if for ip 4 so 6 has not been validated.
- INTERFACE: Interface the dhcp server should bind to on the host. Defaults to eth0.
- SOURCE_CONF_PATH: Path the entrypoint will expect the configuration file to be at. Defaults to /opt/dhcp/dhcpd.conf.
- RUNTIME_USER: The dhcp server will be running as this user. Defaults to www-data. Note that because the dhcp daemon expects this user to exist, you'll have to extent the image if the pre-existing users in the image are unsuitable for your purpose.

# Example

There is an example complete with a sample configuration and docker-compose file that can easily be adapted for simple needs.

# Manual Push for Arm64

The image comes (or will come when I get around to pushing the arm64 version in the upcoming days) in both amd64 and arm64 flavors.

However, to the best of my knowledge, docker hub doesn't have a builder for arm64 images currently so the arm64 version has to be pushed manually.
