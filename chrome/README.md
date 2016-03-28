#dockerfile: jEdit

This is an adaptation of a popular Chrome dockerfile that was needed to make it work on my machine.

I abstracted necessary runtime arguments in a docker-compose file.

#Usage

1) Edit the docker-compose.yml file to convey your particular settings:

- Change the _UID environment variable to reflect your particular executiong context
- Change the $HOME/Downloads directory in the volumes to reflect where you want your downloads to go
- Change the $HOME/.config/google-chrome directory in the volumes to reflect where you want the rest of your Chrome data (bookmarks & al.) to go
- Change the mem_limit and cpuset settings to reflect the amount of memory and CPU cores you wish the Chrome container to use

2) Run docker-compose up to launch Chrome

3) Run docker-compose rm to cleanup your environment when done

