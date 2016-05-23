'use strict';

const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({ port: 8080 });

server.route([
    {
        method: 'GET',
        path: '/hello_world',
        handler: function (request, reply) {
            reply('Hello World');
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
    console.log('Sigterm received. Terminating hello world module...');
    server.stop((err) => {
        process.exit(0);
    });
});
