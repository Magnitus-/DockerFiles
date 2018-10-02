FROM python:3-stretch

ENV CONFIG_DIRECTORY /etc/network-setup
ENV TEMPLATE_DIRECTORY /opt/templates
ENV SCRIPT_DIRECTORY /opt/scripts

RUN pip install Jinja2 pyyaml docker && mkdir -p $SCRIPT_DIRECTORY && mkdir -p $TEMPLATE_DIRECTORY

COPY generate_config.py $SCRIPT_DIRECTORY/
COPY *.j2 $TEMPLATE_DIRECTORY/

CMD ["/opt/scripts/generate_config.py"]