FROM debian:stretch

RUN apt-get update && apt-get install -y chrony

CMD ["/usr/sbin/chronyd", "-d"]