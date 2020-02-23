FROM openjdk:15-slim-buster

RUN apt-get update && \
    apt-get install -y build-essential libssl-dev libffi-dev python3-dev && \
    ln -s /usr/bin/python3 /usr/bin/python

RUN apt-get install -y python3-pip && \
    ln -s /usr/bin/pip3 /usr/bin/pip

RUN pip install jupyter

RUN apt-get update && apt-get install -y curl gnupg && \
    echo "deb https://dl.bintray.com/sbt/debian/ /" > /etc/apt/sources.list.d/sbt.list && \
    curl -sL "https://keyserver.ubuntu.com/pks/lookup?op=get&search=0x2EE0EA64E40A89B84B2DF73499E82A75642AC823" | apt-key add && \
    apt-get update && apt-get install -y sbt

RUN pip install py4j

WORKDIR /opt

RUN curl http://muug.ca/mirror/apache-dist/spark/spark-2.4.5/spark-2.4.5-bin-hadoop2.7.tgz --output spark-2.4.5-bin-hadoop2.7.tgz && \
    tar zxvf spark-2.4.5-bin-hadoop2.7.tgz && \
    rm spark-2.4.5-bin-hadoop2.7.tgz

ENV SPARK_HOME=/opt/spark-2.4.5-bin-hadoop2.7
ENV PATH="/opt/spark-2.4.5-bin-hadoop2.7/bin:${PATH}"
ENV PYSPARK_DRIVER_PYTHON=jupyter
ENV PYSPARK_DRIVER_PYTHON_OPTS=notebook

RUN cd /opt/spark-2.4.5-bin-hadoop2.7/python && python setup.py install

CMD ["jupyter", "notebook", "--no-browser", "--allow-root", "--ip", "0.0.0.0"]