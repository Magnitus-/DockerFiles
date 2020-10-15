FROM ubuntu:20.04

RUN apt-get update && apt-get install -y openssl openssh-client

COPY ssh-decrypt ssh-encrypt /usr/bin/

WORKDIR /opt