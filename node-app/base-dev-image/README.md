##Development Base Image

Unlike the production-oriented base image, the development image can be used as is with a joining docker-compose file without customization.

Of course, customizations are possible by inheriting from the image (to add environment variable and other customizations).

###Customizations

The docker-compose file should have the following settings:

- UID Environment variable: Determines the user and group ID that the node app will run under in the container
- NPM_COMMAND Environment Variable: Determines the command that will be passed as to "npm run" when the container launches. Defaults to "start".
- NPM_MODULES environment variable: npm modules that should be globally available to code in your app (see base image documentation for greater details).
- ALWAYS_INSTALL variable: Set this environment variable if you want npm install & shared module linking each time you start your container. Leaving it unset will greatly speed up re-starting the container, but will also force you to destroy and re-create the container if you change your dependencies in package.json files. 
- /home/node-app/app volume mapping: Map your main application to this path in the image (see base image documentation for greater details).
- /home/node-app/shared_modules: Map your local shared modules to this path in the image (see base image documentation for greater details).

###Examples

The 'example' directory contain an example with the docker-compose file already prepared. Its the same example as example 4 for the base-image, but adapted to the development image.


