# jEdit

**NOTICE:** This image is not longer maintained as I no longer use jEdit as my primary editor.

This is a dockerfile for the jEdit text editor.

# Usage

1) Edit the docker-compose.yml file to convey your particular settings:

- Change the _USER and _UID environment variables to reflect your particular executiong context
- Change the /home/eric directory in the volumes to reflect your user
- Change the /home/eric/Projects directory in the volumes to reflext the directory containing the files you want to edit with jEdit

2) Run docker-compose up
3) By differienciating the configuration and placement of the docker-compose.yml file, you can seperate your file editing environments.
