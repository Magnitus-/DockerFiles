##Automated Image Creation Using the image-builder Image and Customized docker-compose.yml File Derived From the Template

Take the docker-compose.yml template file and customize is for your needs (any parts between <<...>> should be customised).

###Build Note

Because the docker client runs in a container and the docker daemon that actually builds the image runs on the local machine outside the container the client runs on, I had to do a work-around to make the app files available to the daemon.

Basically, the client runs an http file server and passes in the dockerfile wget commands to the daemon to fetch the files from the server. This means that the build container must map a port to the local machine.

Furthermore, it implies an additional delay at build time, but it also makes the resulting image more efficient (all files are imported in a single RUN statement resulting in a single layer).

###Customizations

* container-name: Name of the container that builds the image (mostly useful to avoid name clashed with already running containers)
* environment
    * UID: Running user ID of the image
    * SOURCE_IMAGE: This optional environment variable allows you to use a source image other than the default (magnitus/node-app:4 at the time of this writing). Useful if you want to use the slim version (magnitus/node-app:4-slim) or an image that adds extra stuff to the default image (extra environment variables, global modules, etc)
    * OUTPUT_IMAGE: Full image name of the resulting image
    * IGNORE: Regex pattern identifiying files that the dockerfile should not copy (for example, my text editor always creates backup files ending with ~ that I don't want included in a production image)
    * EXTERNAL_PORT: Port on your local machine that your container maps to. It's extremely important that this value corresponds to the mapping that you give in the "ports" section.
    * DOCKER_LOCALHOST: Address if your localhost machine on the docker networking interface (in Linux, run ifconfig to find it, you should have a 'docker0' interface by default with an 'inet addr' entry)
    * CACHE: Whether to use cached intermediate images or not when building anew (should be yes or no) 
* volume mapping
    * App directory: Change the LHS of the volume mapping to map to the directory where your app is contained
    * Shared directory: Change the LHS of the volume mapping to map to the directory where your local shared modules are located
* ports: Change the LHS entry to a free port on your host. Don't forget to give the same value to the EXTERNAL_PORT environment variable.
    
###Output

The corresponding image should have been built by the docker-daemon on your machine. 

###Examples

The 'image-builder-image-example' directory contain an example, adapted to have its image automatically generated (port 8080 will need to be free on your machine for the example to work).
