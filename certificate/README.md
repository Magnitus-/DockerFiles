# certificate

## Overview

This image is used to generate certificates and is based on my understanding reading TLS certificates literature and various tutorials I found online.

The image can be used to generate self-signed certificates or CA-signed certificates (if you manage your own internal certificate authority)

## Usage

Containers launched from this image will generate 3 files in an output directory:

- The certificate (file ending with the .crt suffix)
- The certificate signing request (file ending with the .csr suffix)
- The private key used to sign the certificate signing request and in the case of a self-signed certificate, the certificate as well (file ending with the .key suffix)

The certificate will be (re)generated each time a container is ran from the image, but the private key and certificate signing requests will only be generated once if they are found in the expected directory on subsequent executions.

You can pass a CA key and its accompanying certificate if you want a CA-signed certificate as opposed to a self-signed certificate. Those files won't be generated for you, but you can generate them in a prior invocation of the image by generating a self-signed certificate which can act as your CA credentials.

The container's behavior can be customized with the following environment variables:

- **COUNTRY**: Country of the certificate
- **STATE**: State/province of the certificate
- **CITY**: City of the certificate
- **ORGANIZATION**: Organization/company the certificate is for
- **DEPARTMENT**: Department within the organization/company the certificate is for
- **EMAIL**: Contact email for the certificate
- **DOMAINS**: Domain(s) the certificate will be valid for. If you specify several domains, you sould separate entries with the **;** character.
- **CERTIFICATE_DURATION**: Lifetime of the certificate in days before it expires (defaults to 365 if omitted)
- **OUTPUT_DIR**: Output directory in the container where generated files will be placed (defaults to /opt/output if omitted). It is recommend that this directory be bound to a directory outside the container to access the generated files.
- **KEY_FILE**: Filename of the generated private key file (defaults to domain.key if omitted). If the value of "" is passed, the file will be named ```DOMAIN[0].key``` instead, where ```DOMAIN[0]``` is the first entry in the domain list you specified.
- **CSR_FILE**: Filename of the generated certificate signing request file (defaults to domain.csr if omitted). If the value of "" is passed, the file will be named ```DOMAINS[0].csr``` instead, where ```DOMAINS[0]``` is the first entry in the domain list you specified.
- **CERTIFICATE_FILE**: Filename of the generated certificate file (defaults to domain.crt if omitted). If the value of "" is passed, the file will be named ```DOMAIN[0].crt``` instead, is the first entry in the domain list you specified.
- **KEY_PASSWORD**: If you want to encrypt the generated private key file, specify a password to use for the encryption (note that any utility accessing the private key file will need to use this password). Note that you'll also have to specify an encryption cypher via the "KEY_ENCRYPTION_CYPHER" environment variable.
- **KEY_PASSWORD_FILE**: Similar to the key "KEY_PASSWORD" environment variable above, except that you are specifying the file where the password is to be found instead (useful if you want to use a secret to store the password). Note that this needs to be the entire path of the file, not just the filename. Like the "KEY_PASSWORD" environment variable, you'll have to specify an encryption cypher as well.
- **KEY_ENCRYPTION_CYPHER**: Encryption cypher used to encrypt the private key file with your password. Google "openssl genrsa cyphers" for a list of valid cyphers. At the time of this writing, I see the following cyphers in the documentation: aes128, aes192, aes256, camellia128, camellia192, camellia256, des, des3, idea
- **KEY_BITS**: Size of the generated private key in bits (defaults to 2048 if omitted)
- **OUTPUT_CERTIFICATE_INFO**: Will output the generated certificate info if set to "true"
- **CA_KEY_FILE**: Path to a pre-existing CA key file if you want to sign the certificate using a pre-existing CA key. It can be omitted for self-signed certificates. If present, the **KEY_FILE** will still be used to sign the certificate signing request.
- **CA_CERTIFICATE_FILE**: Path to a pre-existing CA certificate signed with the CA key file. This environment variable should be specified if and only if the **CA_KEY_FILE** environment varialbe is also specified.
- **CA_KEY_PASSWORD**: Password for the **CA_KEY_FILE** if it is password protected.
- **CA_KEY_PASSWORD_FILE**: Similar to the key **CA_KEY_PASSWORD** environment variable above, except that you are specifying the file where the password is to be found instead
- **CA_SERIALIZATION_FILE**: Path to the CA serialization file (containing a number that gets incremented each time the CA certificate/key are used during a certificate signature). If no value is set, a serialization file will automatically be generated with same path as **CA_CERTIFICATE_FILE** and the same filename ending with a **.srl** extension.

## Examples

...

## tests

...

## Versioning

I don't foresee that much changes (changes will be driven by the evolution of my needs for generating certificates which aren't much) so this topic may be moot...

Versions are labeled ```X``` and ```X.Y``` and ```X.Y.Z```, where **X** is the major version number, **Y** is the minor version number and **Z** is the bug version number (following the semver convention).

The **latest** tag may change in a way that breaks the previous release, so if you need something reliable, I recommend sticking with a particular version and not the **latest** tag.

## Previous Image Name

I previously created a repo on Docker hub for self-signed certificates called **self-signed-certificate-generator**.

After I determined that I also needed certificates generated from internal certificate authority to make the most of various tools, I created a new image name more appropriately called **certificate-generator**.

However, the code of **certificate-generator** is simply a more flexible adaptation of the code for **self-signed-certificate-generator**.

More specifically, for self-signed certificates, **magnitus/certificate-generator:1** is backward compatible with **magnitus/self-signed-certificate-generator:v2**.
