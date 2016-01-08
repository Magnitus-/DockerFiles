echo "${_USER}:x:${_UID}:${_UID}:${_USER},,,:/home/${_USER}:/bin/bash" >> /etc/passwd && \
echo "${_USER}:x:${_UID}:" >> /etc/group && \
chown $_UID:$_UID -R /home/$_USER && \
su - $_USER -c "jedit"
