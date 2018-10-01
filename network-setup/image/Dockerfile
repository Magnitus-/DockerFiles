FROM python:3-stretch

ENV CONF_TARGET /etc/network-setup

RUN pip install Jinja2 pyyaml docker && mkdir -p /opt/scripts && mkdir -p /opt/templates

COPY generate_config.py /opt/scripts/
COPY *.j2 /opt/templates/

CMD ["/opt/scripts/generate_config.py"]