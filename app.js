// Integrate HAPI and Mongoose Module.
var hapi = require('hapi'),
    mongoose = require('mongoose');

var Schema = mongoose.Schema;

// Create a server object, Establish a server connection.
var server = new hapi.Server();

server.connection({ port:2000 });

// Connect mongoDB with mongoose.
mongoose.connect("mongodb://localhost/to-dos");
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function () {
	console.log("Connection to mongoDB is successful");
});

// Create a schema for to-dos model
var todoSchema = new Schema({
	todo: String,
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now }
});

// Create a todo model
var Todo = mongoose.model('Todo', todoSchema);

// Create a post route to save the to-dos list in DB.
server.route({
	method: 'POST',
	path: '/newTodo',
	handler: function(request,reply) {
		var todo = new Todo(request.payload);
		todo.save(function(err, todo) {
			if(!err) {
				reply(todo);
			}else{
				reply(err);
			}
		});
	}

});

// Create a get route to retrive the to-dos list from DB.
server.route({
	method: 'GET',
	path: '/todos',
	handler: function(request,reply) {
		Todo.find({}, function(err, todo) {
			if(!err) {
				reply(todo);
			}else{
				reply(err);
			}
		});
	}
});

// Create a get route to retrieve only one to-do based on id
server.route({
	method: 'GET',
	path: '/todo/{id}',
	handler:  function(request,reply) {
		Todo.findOne({
			_id: encodeURIComponent(request.params.id)
		}, function(err, todo) {
			if(!err && todo) {
				reply(todo);
			} else if(!err) {
				reply({
					message: "To-do Not found"
				});
			} else {
				reply(err);
			}
		});
	}
});

// Create a put route to update the to-dos list in DB.
server.route({
	method: 'PUT',
	path: '/todo/{id}',
	handler: function(request,reply) {
		Todo.findOne({
			_id: encodeURIComponent(request.params.id)
		}, function(err, todo) {
			if(!err && todo) {
				todo.todo = request.payload.todo;
				todo.save(function(err,todo) {
					if(!err) {
						reply(todo);
					}else{
						reply(err);
					}
				});
			} else if(!err) {
				reply({
					message: "To-do Not found"
				});
			} else {
				reply(err);
			}
		});
	}
});

// Create a delete route to delete the existing to-do.
server.route({
	method: 'Delete',
	path: '/removeTodo/{id}',
	handler: function(request,reply) {
		Todo.findOne({
			_id: encodeURIComponent(request.params.id)
		}, function(err, todo) {
			if (!err && todo) {
				todo.remove();
				reply({
					message: "To-do removed successfully"
				})
			} else if(!err) {
				reply({
					message: "To-do Not found"
				});
			} else {
				reply(err);
			}
		});
	}
});


// Start the server.
server.start(function () {
	console.log("Server running at: ", server.info.uri );
});