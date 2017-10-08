# react-build

## Notice

While functional, the tooling for this image, with browserify, is dated by 2017 standards. Most frontend projects would now use es6 modules with webpack.

As I'm now in a more backend phase of my workflow, I'll revisit this image when the need for it is felt.

## Purpose

Images to build single-file react bundles with commonjs modules as well as (optional) es-2015, jsx, minification and file watch support.

Makes use of browserify and babel.

## Images

The are two main images:

- the onbuild image (onbuild tag) that needs to be the parent of a child image, but that has the final image execute with reduced privilege
- the regular image (latest tag) that can be used directly, but has to run as root
- Additionally, both images have a slim variant that is based on the slim node image

## Usage

### Environment Variables

Both the onbuild and regular image need to be executed with the BUILD_FILE environment variable set to the path in the container's file system where the build file can be found.

Additionally, because the regular image executes as root, it needs an OUTPUT_UID environment variable that sets which user will be the owner of the final bundled file.

### Mapped Volumes

Both images should be executed in a container where all the source code files (js and jsx) to compile, the build file (json) and the distribution directory are mapped between the host filesystem and the container filesystem (see exemples).

Alternatively, if you have a more strict containers-only build flow, shared docker-managed volumes might also do the work, though such considerations are beyond the scope of this documentation.

### dockerfile

If you use the onbuild image, you need to finalize the image you'll use in a dockerfile.

You need to perform the following tasks in the dockerfile:

- Set the UID environment variable to the user ID who should own the files you'll operate on on your host
- Run the finalize.sh script
- Set the container user to UID

See the onbuild exemple for an implementation of this.

### build file

The build file is a json file that directs how your source files are processed and bundled into the final file.

Here are the entries:

- destination: Path of the final bundled file in the container
- dependencies: Array of external dependencies you'll use. Possible values are: react, react-dom, redux. Those external dependencies can be required under those names in your code
- watch: Boolean that sets whether the container should compile your code once or whether it should compile it and re-compile it each time any of the source files are changed
- minify: Boolean that specifies if the result code should be minifed. If set to true, the code will be minified with uglify.
- modules: Object having your module names as keys and the path of their corresponding source file as values. The '*' entry is a special entry. It's an array of folders containing files which should also be bundled and whose module name is their file name, without the extension.
- entrypoints: List of files (or folders containing the files) that should be executed directly when the bundled file is loaded (module code only executes when first required)
- extensions: Array of file extensions that should be included during folder traversals. If this property is not defined, all files will be processed in entries specifying folders, no matter the extension.
