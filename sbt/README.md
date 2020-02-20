# Purpose

This is a development image to develop scala code.

I consider it a work in progress so I won't push an image for it on the foreseeable future, but you can build it on your machine.

# Usage

From this directory, run the following to build the image:

```
docker build -t sbt:latest .
```

Then, type the following to open an interactive shell in the containers:

```
docker run -it --rm sbt:latest bash
```

If you want to test the image with an hello world example, type the following inside the containers:

```
cd /opt
sbt new scala/hello-world.g8
```

Press enter when prompted and then type the following to open an sbt console:

```
cd hello-world-template
sbt
```

Then, press the following to run your hello-world example:

```
run
```