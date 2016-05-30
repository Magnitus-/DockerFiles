#!/bin/bash
if ! id "node-app" >/dev/null 2>&1; then
    echo "node-app:x:${UID}:${UID}:node-app,,,:/home/node-app:/bin/bash" >> /etc/passwd;
    echo "node-app:x:${UID}:" >> /etc/group;
    pwconv;
    grpconv;
fi

npm_install.js;
link.js;

chown -R ${UID}:${UID} /home/node-app;
chown -R ${UID}:${UID} ${SHARED_DIR};

(cd ${APP_DIR}; su -c "npm start" node-app);
