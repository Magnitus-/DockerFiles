echo "node-app:x:${UID}:${UID}:node-app,,,:/home/node-app:/bin/bash" >> /etc/passwd;
echo "node-app:x:${UID}:" >> /etc/group;
