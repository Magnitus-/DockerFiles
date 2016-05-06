#node-app

##Purpose

This image provides a skeleton from which custom production images can quickly be build.

##Usage

Take the dockerfile-template file and customize it to your needs. Once that is done, use the modified dockerfile to build your production image.

##Customizations

- UID Environment Variable: Determines the user and group ID that the node app will run under in the container
- app content: This should contain your node application (location of package.json file and app-specific entrypoint and dependencies)
- shared modules content: 

This should contain any recurring private modules that tend to be used accross apps (or accross containers in the same application if you split it into several containers). 

Those modules can be expressed as a dependency elsewhere by adding their name to the 'localDependencies' entry in the package.json file of the dependent (which is an array of shared module names, as named in their respectif package.json files, see the example).

Afterwards, they can be required by the dependend by their module name (as defined in their package.json file).

##Tag Convention

The first number appearing in tag names refers to the version of node the image uses. 

The second number appearing in tag names after the 'v' refers to the revision of the image (which increments as improvements are made).

 
