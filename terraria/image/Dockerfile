FROM ubuntu:18.04

RUN apt-get update && apt-get install -y unzip wget tmux

ARG DOWNLOAD_LINK=https://terraria.org/system/dedicated_servers/archives/000/000/039/original/terraria-server-1405.zip?1591301368

WORKDIR /opt

RUN wget $DOWNLOAD_LINK -O /opt/terraria-server.zip && \
    unzip terraria-server.zip -d /opt/terraria && \
    rm /opt/terraria-server.zip

COPY entrypoint.sh /opt/entrypoint.sh

ENTRYPOINT ["/opt/entrypoint.sh"]