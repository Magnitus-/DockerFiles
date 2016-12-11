FROM node:4

ENV HOME_DIR /home/node-app
ENV SHARED_DIR ${HOME_DIR}/shared_modules
ENV APP_DIR ${HOME_DIR}/app
ENV NPM_COMMAND start
ENV TOOL npm

COPY ["finalize.sh", "/usr/local/bin/"]
COPY ["resolve_dependencies.js", "/opt/app-setup/"]
RUN (cd /opt/app-setup; npm install bluebird; npm install module-linker; npm install recursive-installer; npm install -g yarn) && \
    chmod +x /usr/local/bin/finalize.sh && chmod +x /opt/app-setup/resolve_dependencies.js && \
    mkdir ${HOME_DIR} && mkdir ${APP_DIR} &&  mkdir ${SHARED_DIR} && \
    wget -O /usr/local/bin/dumb-init https://github.com/Yelp/dumb-init/releases/download/v1.0.2/dumb-init_1.0.2_amd64 && \
    chmod +x /usr/local/bin/dumb-init

WORKDIR ${APP_DIR}

ENTRYPOINT ["dumb-init"]
CMD ["bash", "-c", "${TOOL} run ${NPM_COMMAND}"]
