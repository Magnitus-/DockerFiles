FROM ubuntu:14.04
RUN apt-get update && \ 
    apt-get install -y openjdk-7-jdk && \
    apt-get install -y wget && \
    wget 'http://sourceforge.net/projects/jedit/files/jedit-devel/5.2pre1/jedit_5.2pre1_all.deb/download' --output-document=/opt/jedit_5.2pre1_all.deb && \
    dpkg -i /opt/jedit_5.2pre1_all.deb && \
    apt-get purge -y wget && \
    apt-get clean && \
    rm /opt/jedit_5.2pre1_all.deb
COPY ["./entryScript.sh", "/opt/entryScript.sh"]
RUN chmod +x /opt/entryScript.sh
ENTRYPOINT ["/bin/bash", "/opt/entryScript.sh"]
