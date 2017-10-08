# dockerfile: atom-electron

NOTICE: Dockerizing my text editor, while nice, is not a top priority so this image will be updated on a per-need basis (possibly never). Besides, I've already switched to spyder for my Python workflow. Who knows what editor I'll be using in 3 years for my js/bash/C++/"possible future language" workflow.

This is a dockerfile to launch an electron gui within a docker container.

Currently, the sole image is oriented toward a dev environment where the the source code changes a lot (and is therefore in a bound volume), because it's where I'm at.

I'm merely beginning my electron(ic) journey and so far this image only ran an "hello world" example, so I can't really vouch about its correctness yet, except that it can run an hello world example :).

# Usage

The 'dockerfile' and 'entryScript.sh' files that I used to build the image that was pushed in the docker hub are included for completeness, but not necessary to run the image.

You just need to use docker-compose to make use of the prescribed settings to launch the container.

You'll want to tweak the settings (user name and id and corresponding home folder) in the docker-compose.yml file to reflect your environment and change the content of the 'app' directory with your electron app.
