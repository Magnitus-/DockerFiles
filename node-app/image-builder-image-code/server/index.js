'use strict';

const Hapi = require('hapi');
const Inert = require('inert');

const server = new Hapi.Server();
server.connection({ port: 8080 });

server.register(Inert, () => {});

server.route([
{ 
   method: 'GET', 
   path: (process.env.APP_DIR+'/{param*}'), 
   handler: { 
                directory: { 
                    path: process.env.APP_DIR 
                }
            }
},
{ 
   method: 'GET', 
   path: (process.env.SHARED_DIR+'/{param*}'), 
   handler: { 
                directory: { 
                    path: process.env.SHARED_DIR
                }
            }
}
]);

server.start((err) => {
    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});

process.on('SIGTERM', () => {
    console.log('Sigterm received. Terminating process...');
    server.stop((err) => {
        process.exit(0);
    });
});
