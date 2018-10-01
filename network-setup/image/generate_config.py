#!/usr/local/bin/python

import os

import docker
import jinja2
from yaml import load

def get_configurations():
    with open('/opt/conf') as config_file:
        return load(config_file)

def generate_dns_config(configurations):
    pass

def generate_dns_zonefileS(configurations):
    pass

def generate_dhcp_config(configurations):
    pass

def launch_services(configurations):
    pass

if __name__ == "__main__":
    configurations = get_configurations()
    generate_dns_config(configurations)
    generate_dns_zonefileS(configurations)
    generate_dhcp_config(configurations)
    launch_services(configurations)