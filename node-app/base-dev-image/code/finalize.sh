#!/bin/bash
if ! id "node-app" >/dev/null 2>&1; then
    echo "node-app:x:${UID}:${UID}:node-app,,,:/home/node-app:/bin/bash" >> /etc/passwd;
    echo "node-app:x:${UID}:" >> /etc/group;
    pwconv;
    grpconv;
fi

if [ ! -z "$ALWAYS_INSTALL" ] || [ ! -f "${HOME_DIR}/installation_done" ] ; then
    /opt/app-setup/resolve_dependencies.js;
    if [ -z "$ALWAYS_INSTALL" ] ; then
        touch ${HOME_DIR}/installation_done;
    fi
fi

chown -R ${UID}:${UID} /home/node-app;
chown -R ${UID}:${UID} ${SHARED_DIR};

if [ -z "$NPM_COMMAND" ]; then
    NPM_COMMAND="start";
fi

(cd ${APP_DIR}; su -c "npm run ${NPM_COMMAND}" node-app);
