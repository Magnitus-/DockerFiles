#!/usr/local/bin/python

import os
import datetime
import re

import docker
from jinja2 import Template
from yaml import load

TEMPLATES_DIRECTORY = os.environ['TEMPLATE_DIRECTORY']
CONFIG_DIRECTORY = os.environ['CONFIG_DIRECTORY']

SERVICE_NAMES = {
    'dns': os.environ.get('DNS_SERVICE_NAME', 'dns'),
    'dhcp': os.environ.get('DHCP_SERVICE_NAME', '{domain}-dhcp')
}

DNS_IMAGE = os.environ.get('DNS_IMAGE')
DHCP_IMAGE = os.environ.get('DHCP_IMAGE')

DNS_TTL = {
    'default': 86400,
    'short': 300
}

DHCP_LEASE_TIME = {
    'default': 600,
    'max': 7200
}

DHCP_FILENAME_TEMPLATE = 'dhcp.{domain}.conf'


def get_configurations():
    with open('/opt/conf') as config_file:
        return load(config_file)

#Placeholder
route_ip_regex = re.compile('src[ ](?P<ip>[0-9]+[.][0-9]+[.][0-9]+[.][0-9]+)[ ]')
def get_interfaces_ip_maps(configurations):
    interfaces_ip_maps = {}
    client = docker.from_env()
    route_outputs = client.containers.run(
        "network-setup_setup:latest", 
        "ip route",
        network_mode="host",
        remove=True
    ).decode('utf-8').strip().split('\n')

    for name in configurations['networks']:
        interface = configurations['networks'][name]['interface']
        for route_output in route_outputs:
            if not route_output.startswith('default via') and 'dev {interface}'.format(interface=interface) in route_output:
                match = route_ip_regex.search(route_output)
                if match is not None:
                    interfaces_ip_maps[interface] = match.group('ip')

    return interfaces_ip_maps

def generate_dns_config(configurations):
    with open(os.path.join(TEMPLATES_DIRECTORY, 'dns.conf.j2'), 'r') as template_file:
        template = Template(template_file.read())
        with open(os.path.join(CONFIG_DIRECTORY, 'dns.conf'), 'w+') as configuration_file:
            content = template.render(
                fallback_dns_server=configurations['fallback_dns_server'],
                networks=[{'domain': name} for name in configurations['networks']]
            )
            configuration_file.write(content)

def generate_dns_zonefiles(configurations, interfaces_ip_maps):
    with open(os.path.join(TEMPLATES_DIRECTORY, 'zonefile.j2'), 'r') as template_file:
        template = Template(template_file.read())
        for name in configurations['networks']:
            network = configurations['networks'][name]
            with open(os.path.join(CONFIG_DIRECTORY, 'zonefile.{domain}'.format(domain=name)), 'w+') as zonefile:
                content = template.render(
                    ttl=DNS_TTL,
                    timestamp=datetime.datetime.utcnow().strftime("%Y%m%d"),
                    domain=name,
                    network=network,
                    ip=interfaces_ip_maps[network['interface']]
                )
                zonefile.write(content)

def generate_dhcp_config(configurations, interfaces_ip_maps):
    with open(os.path.join(TEMPLATES_DIRECTORY, 'dhcp.conf.j2'), 'r') as template_file:
        template = Template(template_file.read())
        for name in configurations['networks']:
            network = configurations['networks'][name]
            filename = DHCP_FILENAME_TEMPLATE.format(domain=name)
            with open(os.path.join(CONFIG_DIRECTORY, filename), 'w+') as configuration_file:
                content = template.render(
                    ip=interfaces_ip_maps[network['interface']],
                    lease_time=DHCP_LEASE_TIME,
                    network=network
                )
                configuration_file.write(content)

def get_container_id():
    with open('/etc/hostname', 'r') as hostfile:
        return hostfile.read().strip()


def launch_services(configurations, container_id):
    client = docker.from_env()
    client.containers.run(
        DNS_IMAGE, 
        "-conf {conf}".format(conf=os.path.join(CONFIG_DIRECTORY, 'dns.conf')),
        name="dns-server",
        network_mode="host",
        volumes_from=container_id,
        restart_policy={'name': 'always'},
        detach=True
    )
    for name in configurations['networks']:
        pass


if __name__ == "__main__":
    configurations = get_configurations()
    interfaces_ip_maps = get_interfaces_ip_maps(configurations)
    generate_dns_config(configurations)
    generate_dns_zonefiles(configurations, interfaces_ip_maps)
    generate_dhcp_config(configurations, interfaces_ip_maps)
    launch_services(configurations, get_container_id())