#!/usr/local/bin/python

import os
import datetime

import docker
from jinja2 import Template
from yaml import load

TEMPLATES_DIRECTORY = os.environ['TEMPLATE_DIRECTORY']
CONFIG_DIRECTORY = os.environ['CONFIG_DIRECTORY']

DNS_TTL = {
    'default': 86400,
    'short': 300
}

def get_configurations():
    with open('/opt/conf') as config_file:
        return load(config_file)

#Placeholder
def get_interfaces_ip_maps():
    return {
        'eth0': '192.168.10.2',
        'eth1': '192.168.11.1'
    }

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

def generate_dhcp_config(configurations):
    pass

def launch_services(configurations):
    pass

if __name__ == "__main__":
    configurations = get_configurations()
    generate_dns_config(configurations)
    generate_dns_zonefiles(configurations, get_interfaces_ip_maps())
    generate_dhcp_config(configurations)
    launch_services(configurations)