##Manual Dockerfile Creation From Base Image and Customization of 'dockerfile-template' 

Take the dockerfile-template file (or the dockerfile-template-slim file if your prefer more barebone small images) and customize it to your needs. Once that is done, use the modified dockerfile to build your production image.

###Customizations

- UID Environment Variable: Determines the user and group ID that the node app will run under in the container
- NPM_COMMAND Environment Variable: Determines the command that will be passed as to "npm run" when the container launches. Defaults to "start".
- app content: This should contain your node application (location of package.json file and app-specific entrypoint and dependencies)
- shared modules content: 

This should contain any recurring private modules that tend to be used accross apps (or accross containers in the same application if you split it into several containers which is admitedly my primary use-case). 

Those modules can be expressed as a dependency elsewhere by adding their name to the 'localDependencies' entry in the package.json file of the dependent (which is an array of shared module names, as named in their respectif package.json files, see the example).

Afterwards, they can be required by the dependend by their module name (as defined in their package.json file).

- npm modules: 

This should contain a semi-colon separated list of npm modules that you want installed and accessible everywhere in your app.

Note that these "global" npm modules are fallbacks will only be used by your app and shared modules if they are absent from the dependencies in package.json files or if the greater version number matches that of the package.json dependency.

In the context of application-specific containers with a lot of in-house modules, I think it's a decent compromise between global hell and DRY. 

This allows you to do something like this: say that your app and all shared modules but one use version 3 of bluebird and one shared module use version 2 of bluebird, you can put 'bluebird@3' in the NPM_MODULES environment variable and then put a version 2 dependency in the package.json file of the shared module that uses version 2.

###Tag Convention

The first number appearing in tag names refers to the version of node the image uses. 

The second number appearing in tag names after the 'v' refers to the revision of the image (which increments as improvements are made).

###Examples

The 'example' directory contain an example of a manually generated dockerfile for a project with shared dependencies.

The 'example2' directory contain an example for a basic 'hello-world' hapi app.

The 'example3' directory contains a modified version of the 'example' with shared dependencies layered more deedply into the directory structure and one shared dependency requiring another.

The 'example4' directory contains an example that illustrates the use of the NPM_MODULE environment variable for a global npm module combined with a package.json version override for a shared module.
