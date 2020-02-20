FROM openjdk:14-jdk-buster

RUN apt-get update && apt-get install -y curl gnupg
RUN echo "deb https://dl.bintray.com/sbt/debian/ /" > /etc/apt/sources.list.d/sbt.list
RUN curl -sL "https://keyserver.ubuntu.com/pks/lookup?op=get&search=0x2EE0EA64E40A89B84B2DF73499E82A75642AC823" | apt-key add
RUN apt-get update && apt-get install -y sbt
RUN sbt --version