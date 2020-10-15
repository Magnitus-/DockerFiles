# About

This image is used to encrypt and decrypt a file using an ssh key.

Sometimes, you just want to pass something encrypted over the internet and don't have an obvious secure channel to pass a secret.

However, given that most developpers will already have an ssh key setup on their computer and that it is asymmetric, it can be used to encrypt data with minimum fuss without having to exchange some bootstrap secret over a potentially insecure network.

One dev needs to send the other his public ssh key. If particularly paranoid, some checksum could potentially be done on the provided public ssh key.

# Usage

See the **example** directory for an example encrypting and decrypting a small text file.

It outlines the orchestration contract (ie, expected commands and environment variables) expected by the image.

Note that the encryption command will delete the source file and replace it with an encrypted file and an encrypted symmetric key. The decryption command will need both of these files. Also, for this to work, you need to map the entire directory of the plaintext file as a mapped volume for the container, not just the plaintext file.

