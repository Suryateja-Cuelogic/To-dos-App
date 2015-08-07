// Integrate HAPI and Mongoose Module.
var hapi = require('hapi'),
    mongoose = require('mongoose');

// Create a server object, Establish a server connection.
var server = new hapi.Server();

server.connection({ port:2000 });

// Connect mongoDB with mongoose.
mongoose.connect("mongodb://localhost/to-dos");
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function () {
	console.log("Connection to mongoDB is successful");
});

// Start the server.
server.start(function () {
	console.log("Server running at: ", server.info.uri );
});