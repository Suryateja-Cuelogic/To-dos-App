var hapi = require('hapi');

var server = new hapi.Server();

server.connection({ port:2000 });

server.start(function () {
	console.log("Server running at: ", server.info.uri );
});