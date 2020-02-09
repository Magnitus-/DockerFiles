FROM python:3-slim

ARG FACTORIO_VERSION=0.17.79
ENV FACTORIO_VERSION=$FACTORIO_VERSION
LABEL "factorio.version"=$FACTORIO_VERSION

ENV TEMPLATES_PATH=/opt/templates
ENV CONFIGS_PATH=/opt/data/configs
ENV GAME_PATH=/opt/data/games

RUN apt-get update && apt-get install -y wget xz-utils

WORKDIR /opt

RUN wget --output-document factorio.tar.xz https://factorio.com/get-download/$FACTORIO_VERSION/headless/linux64 && \
    tar -xJf factorio.tar.xz && \
    rm factorio.tar.xz

COPY requirements.txt /opt

RUN pip install -r requirements.txt

COPY code /opt/code
COPY templates /opt/templates

WORKDIR /opt/code

ENTRYPOINT ["python", "/opt/code/entrypoint.py"]