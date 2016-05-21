##Automated Dockerfile Creation Using the dockerfile-builder Image and a Customized docker-compose.yml File Derived From the Template

Take the docker-compose.yml template file and customize is for your needs (any parts between <<...>> should be customised).

###Customizations

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

###Output

The dockerfile should appear in the specified output directory along with a build.sh bash script to build it.

###Examples

The 'dockerfile-builder-image-example' directory contain an example, adapted to have its dockerfile automatically generated.
