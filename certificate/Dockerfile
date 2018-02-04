FROM debian:jessie

ENV KEY_FILE domain.key
ENV CSR_FILE domain.csr
ENV CERTIFICATE_FILE domain.crt
ENV OUTPUT_DIR /opt/output
ENV KEY_BITS 2048
ENV CERTIFICATE_DURATION 365

RUN apt-get update && apt-get install -y openssl && apt-get install -y python

COPY generateCertificate.py /opt/scripts/

CMD ["python", "/opt/scripts/generateCertificate.py"]
