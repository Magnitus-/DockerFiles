FROM magnitus/node-app:4-slim

COPY "app/*" ${APP_DIR}/

ENV UID="0"

RUN finalize.sh

USER $UID
