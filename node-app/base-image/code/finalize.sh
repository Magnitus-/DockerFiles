echo "node-app:x:${UID}:${UID}:node-app,,,:/home/node-app:/bin/bash" >> /etc/passwd;
echo "node-app:x:${UID}:" >> /etc/group;

/opt/app-setup/resolve_dependencies.js;

chown -R ${UID}:${UID} /home/node-app;
chown -R ${UID}:${UID} ${SHARED_DIR};
