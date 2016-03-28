echo "chrome:x:${_UID}:${_UID}:chrome,,,:/home/chrome:/bin/bash" >> /etc/passwd && \
echo "chrome:x:${_UID}:" >> /etc/group && \
chown ${_UID}:${_UID} /home/chrome && \
chown ${_UID}:${_UID} /data && \
usermod -a -G audio chrome && \
su - chrome -c "google-chrome --user-data-dir=/data"
