# self-signed certificate

## Overview

This image is used to generate self-signed certificates and is based on my understanding reading TLS certificates literature and various tutorials I found online.

When developping, or sometimes for strictly internal needs (ex: internal services, build machines, etc) where you forego running your own CA in favor of a certificates whitelist, you'll want to generate 100% internal certificate(s) for TLS that you don't have to validate externally with a CA and the openssl commands to achieve this are just complicated enough to warrant being automated.

This image is meant to do that with enough composability to be re-usable across projects.

## Usage

Containers launched from this image will generate 3 files in an output directory:

- The certificate (file ending with the .crt suffix)
- The certificate signing request (file ending with the .csr suffix)
- The private key used to sign the certificate (file ending with the .key suffix)

The certificate will be (re)generated each time a container is ran from the image, but the private key and certificate signing requests will only be generated once if they are found in the expected directory on subsequent executions.

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

## example

See the **example** directory for a properly configured docker-compose file that you can play with. You can execute it by running ```docker-compose up``` in the example directory.

## Versioning

I don't foresee that much changes (changes will be driven by the evolution of my needs for self-signed certificates which aren't much) so this topic may be moot...

Stable versions are labeled ```v<NO>``` where ```NO``` is a version number and any update within the same version number will remain backward compatible.

The **latest** tag may change in a way that breaks the previous release, so if you need something reliable, I recommend sticking with a particular version and not the **latest** tag.
