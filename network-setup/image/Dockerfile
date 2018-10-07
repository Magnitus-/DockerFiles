FROM python:3-stretch

ENV CONFIG_DIRECTORY /etc/network-setup
ENV TEMPLATE_DIRECTORY /opt/templates
ENV SCRIPT_DIRECTORY /opt/scripts

RUN pip install Jinja2 pyyaml docker && mkdir -p $SCRIPT_DIRECTORY && mkdir -p $TEMPLATE_DIRECTORY

ENV DNS_IMAGE=coredns/coredns:latest
ENV DHCP_IMAGE=magnitus/isc-dhcp-server:latest

COPY setup.py $SCRIPT_DIRECTORY/
COPY *.j2 $TEMPLATE_DIRECTORY/

CMD ["/opt/scripts/setup.py"]