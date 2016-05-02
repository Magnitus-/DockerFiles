(cd /home/node-app/app; npm install);
for directory in ${SHARED_DIR}/*; do
    (cd ${directory}; npm install);
done

chown -R ${UID}:${UID} /home/node-app;
chown -R ${UID}:${UID} ${SHARED_DIR};
