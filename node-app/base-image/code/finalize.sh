echo "node-app:x:${UID}:${UID}:node-app,,,:/home/node-app:/bin/bash" >> /etc/passwd;
echo "node-app:x:${UID}:" >> /etc/group;

/opt/app-setup/npm_install.js;
/opt/app-setup/link.js;

chown -R ${UID}:${UID} /home/node-app;
chown -R ${UID}:${UID} ${SHARED_DIR};
