#node-app

##Purpose

This image provides a skeleton from which custom production images can quickly be build.

##Usage

###Manual Dockerfile Creation From base image and dockerfile-template

Take the dockerfile-template file and customize it to your needs. Once that is done, use the modified dockerfile to build your production image.

####Customizations

- UID Environment Variable: Determines the user and group ID that the node app will run under in the container
- app content: This should contain your node application (location of package.json file and app-specific entrypoint and dependencies)
- shared modules content: 

This should contain any recurring private modules that tend to be used accross apps (or accross containers in the same application if you split it into several containers). 

Those modules can be expressed as a dependency elsewhere by adding their name to the 'localDependencies' entry in the package.json file of the dependent (which is an array of shared module names, as named in their respectif package.json files, see the example).

Afterwards, they can be required by the dependend by their module name (as defined in their package.json file).

####Tag Convention

The first number appearing in tag names refers to the version of node the image uses. 

The second number appearing in tag names after the 'v' refers to the revision of the image (which increments as improvements are made).

####Examples

The 'base-image-example' directory contain an example of a manually generated dockerfile for a project with shared dependencies.

The 'base-image-example' directory contain an example for a basic 'hello-world' hapi app.

###Automated Dockerfile Creation Using dockerfile-builder image

Take the docker-compose-template.yml and customize is for your needs (any parts between <<...>> should be customised).

####Customizations

* container-name: Name of the container that builds the dockerfile (mostly useful to avoid name clashed with already running containers)
* environment
    * UID: Running user ID of the image that will be created from the generated dockerfile
    * OUTPUT_UID: User ID of the outputed dockerfile and other dependent files
    * OUTPUT_IMAGE: Full image name of the image that will be created from the generated dockerfile
    * IGNORE: Regex pattern identifiying files that the dockerfile should not copy (for example, my text editor always creates backup files ending with ~ that I don't want included in a production image)
* volume mapping
    * App directory: Change the LHS of the volume mapping to map to the directory where your app is contained
    * Shared directory: Change the LHS of the volume mapping to map to the directory where your local shared modules are located
    * Ouput directory: Change the LHS of the volume mapping to map to the directory where you would like your dockerfile, build script and other dependencies generated

####Output

The dockerfile should appear in the specified output directory along with a build.sh bash script to build it.

####Examples

The 'dockerfile-builder-image-example' directory contain an previous example, adapted to have its dockerfile automatically generated.
