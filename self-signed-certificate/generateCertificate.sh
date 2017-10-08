#!/bin/bash

if [ -z "$KEY_FILE" ]; then
    KEY_FILE="$DOMAIN.key"
fi

if [ -z "$CSR_FILE" ]; then
    CSR_FILE="$DOMAIN.csr"
fi

if [ -z "$CERTIFICATE_FILE" ]; then
    CERTIFICATE_FILE="$DOMAIN.crt"
fi

if [ ! -f "$OUTPUT_DIR/$KEY_FILE" ]; then
    if [ ! -z "$KEY_PASSWORD" ]; then
        CMD="openssl genrsa -out $OUTPUT_DIR/$KEY_FILE \
                            -$KEY_ENCRYPTION_CYPHER \
                            -passout pass:$KEY_PASSWORD $KEY_BITS"
        eval $CMD
    elif [ ! -z "$KEY_PASSWORD_FILE" ]; then
        CMD="openssl genrsa -out $OUTPUT_DIR/$KEY_FILE \
                            -$KEY_ENCRYPTION_CYPHER \
                            -passout file:$KEY_PASSWORD_FILE $KEY_BITS"
        eval $CMD
    else
        openssl genrsa -out "$OUTPUT_DIR/$KEY_FILE" $KEY_BITS
    fi
fi

if [ ! -f "$OUTPUT_DIR/$CSR_FILE" ]; then
    if [ ! -z "$KEY_PASSWORD" ]; then
        openssl req -new \
                    -key "$OUTPUT_DIR/$KEY_FILE" \
                    -out "$OUTPUT_DIR/$CSR_FILE" \
                    -subj "/C=$COUNTRY/ST=$STATE/L=$CITY/O=$ORGANIZATION/OU=$DEPARTMENT/CN=$DOMAIN/emailAddress=$EMAIL" \
                    -passin pass:$KEY_PASSWORD
    elif [ ! -z "$KEY_PASSWORD_FILE" ]; then
        openssl req -new \
                    -key "$OUTPUT_DIR/$KEY_FILE" \
                    -out "$OUTPUT_DIR/$CSR_FILE" \
                    -subj "/C=$COUNTRY/ST=$STATE/L=$CITY/O=$ORGANIZATION/OU=$DEPARTMENT/CN=$DOMAIN/emailAddress=$EMAIL" \
                    -passin file:$KEY_PASSWORD_FILE
    else
        openssl req -new \
                    -key "$OUTPUT_DIR/$KEY_FILE" \
                    -out "$OUTPUT_DIR/$CSR_FILE" \
                    -subj "/C=$COUNTRY/ST=$STATE/L=$CITY/O=$ORGANIZATION/OU=$DEPARTMENT/CN=$DOMAIN/emailAddress=$EMAIL"
    fi
fi

if [ ! -z "$KEY_PASSWORD" ]; then
    openssl x509 \
           -signkey "$OUTPUT_DIR/$KEY_FILE" \
           -in "$OUTPUT_DIR/$CSR_FILE" \
           -req -days $CERTIFICATE_DURATION \
           -out "$OUTPUT_DIR/$CERTIFICATE_FILE" \
           -passin pass:$KEY_PASSWORD
elif [ ! -z "$KEY_PASSWORD_FILE" ]; then
    openssl x509 \
           -signkey "$OUTPUT_DIR/$KEY_FILE" \
           -in "$OUTPUT_DIR/$CSR_FILE" \
           -req -days $CERTIFICATE_DURATION \
           -out "$OUTPUT_DIR/$CERTIFICATE_FILE" \
           -passin file:$KEY_PASSWORD_FILE
else
    openssl x509 \
           -signkey "$OUTPUT_DIR/$KEY_FILE" \
           -in "$OUTPUT_DIR/$CSR_FILE" \
           -req -days $CERTIFICATE_DURATION \
           -out "$OUTPUT_DIR/$CERTIFICATE_FILE"
fi
