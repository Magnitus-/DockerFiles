#node-app

##Purpose

Collection of images to build custom production node application images.

##Images

The Project has 4 main images. Read the documentation provided in the directory of each image for more details about their usage.

###base-image

Base image to build node applications. It can be used on its own by manually building a production dockerfile from the provided template.

Tags: 4, latest, 4-slim, 6, 6-slim

###base-dev-image

Development image, meant to be used for code that changes often in a mapped volume outside the image.

Tags: 4-dev, 6-dev

###dockerfile-builder

Image that automatically builds a production dockerfile of a custom node-app with all dependent files packaged with the dockerfile.

Tag: dockerfile-builder

###image-builder

Image that automatically builds a production image of a custom node-app.

Tag: image-builder

##Assumptions on app structure

The images provided here assume that your app is broken down in two components:

- Main App (required): Main app that contains code specialized for the application.
- Shared modules (optional): Re-usable modules that are not published in a registry (and thus cannot be resolved by npm install), but that may be shared by several apps (or perhaps various parts of your main app if it is split in sub-apps)

###package.json requirements

The shared modules and your main app should all contain a package.json file (and in the case of the shared modules, they should have a valid unique name)

Also, all parts that use shared modules (your main app or other shared modules) should list the shared modules that they use (by name) in the "localDependencies" entry (see the examples)

###Degree of support

- Base Image: The base image, during image construction, will recursively traverse directories in the shared modules, find all modules (it will stop recursing in directories containing a package.json file and will skip over directories named "node_modules") and resolve depencencies (in the main app and other shared modules) via linking.
- Dockerfile Builder: Currently, the dockerfile builder will create dockerfiles and selectively package all dependencies by looking at the top level directories of the shared modules directory only (it does not traverse sub-directories). I plan to make it recursive soon.
- Image Builder: The image build will only copy shared dependencies used by the app in the image. It will recursively traverse the dependencies to make sure that dependencies of dependencies are properly copied.





