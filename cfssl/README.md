# Purpose

Docker images for the cfssl project: https://github.com/cloudflare/cfssl

As I need cfssl to run on arm64 machines and the official binary are not (at the time of this writing) running properly on Scaleway arm64 machines, I opted to create my own arm64 image and also decided to make an amd64 version while I was at it.

# Usage

## Images Names

The image for adm64 is **magnitus/cfssl:latest**. The image for arm64 is **magnitus/cfssl:arm64-latest**

## Included Binaries

The **cfssl** and **cfssljson** were built into the images

## Running It

By default, the execution directory is **/opt** and the command is **sh** (no entrypoint).

You can override the command, setting it run either **cfssl** or **cfssljson** with whatever arguments you need. You can also map whichever directory should provide files input or receive files output to the container.

Take the following command as an example:

```
cfssl gencert -initca ca-csr.json | cfssljson -bare ca -
cfssl gencert -ca=ca.pem -ca-key=ca-key.pem -config=ca-config.json -profile=client client.json | cfssljson -bare client
```

You would run it this way with the docker images:

```
IMAGE=magnitus/cfssl:latest
docker run --rm -v $(pwd):/opt $IMAGE cfssl gencert -initca ca-csr.json \
| docker run --rm -i -v $(pwd):/opt $IMAGE cfssljson -bare ca -
docker run --rm -v $(pwd):/opt $IMAGE cfssl gencert -ca=ca.pem -ca-key=ca-key.pem -config=ca-config.json -profile=client client.json \
| docker run --rm -i -v $(pwd):/opt $IMAGE cfssljson -bare client -
```

All the dependent files for the example can be found in the **example** directory.

# Manual Push

Because I don't think Docker Hub supports arm64 automated builds at this time, the arm64 images have to be pushed manually (ie, no automated build). If you want to use the images, but don't really trust the source (I totally get it), feel free to clone the repo and build your own from the project's Dockerfiles (keeping in mind that you'll need an arm64 machine to build the arm64 images).