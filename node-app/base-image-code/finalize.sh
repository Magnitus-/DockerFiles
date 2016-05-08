echo "node-app:x:${UID}:${UID}:node-app,,,:/home/node-app:/bin/bash" >> /etc/passwd;
echo "node-app:x:${UID}:" >> /etc/group;

(cd /home/node-app/app; npm install);
for directory in ${SHARED_DIR}/*; do
    (cd ${directory}; npm install);
done

link.js;

chown -R ${UID}:${UID} /home/node-app;
chown -R ${UID}:${UID} ${SHARED_DIR};
