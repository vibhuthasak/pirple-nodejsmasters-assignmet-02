// Request Handlers

const _users = require('./_handlers/users');
const _tokens = require('./_handlers/tokens');
const _pizza = require('./_handlers/pizza');

// Handlers object
const handlers = {};

//Users handler
handlers.users = function (data, callback) {
	const acceptableMethods = ['post', 'get', 'put', 'delete'];
	if (acceptableMethods.indexOf(data.method) > -1) {
		handlers._users[data.method](data, callback);
	} else {
		callback(405); // unauthorized method
	}
};

// Add subHandler for users
handlers._users = _users;

// Tokens handler
handlers.tokens = function (data, callback) {
	const acceptableMethods = ['post', 'get', 'put', 'delete'];
	if (acceptableMethods.indexOf(data.method) > -1) {
		handlers._tokens[data.method](data, callback);
	} else {
		callback(405); // unauthorized method
	}
};

// Add subhandler for tokens
handlers._tokens = _tokens;

// Pizza handler
handlers.pizza = function (data, callback) {
	const acceptableMethods = ['post', 'get', 'put', 'delete'];
	if (acceptableMethods.indexOf(data.method) > -1) {
		handlers._pizza[data.method](data, callback);
	} else {
		callback(405); // unauthorized method
	}
};

// Add subHandler for users
handlers._pizza = _pizza;

// Not found handler
handlers.notFound = function (data, callback) {
	callback(404);
};

module.exports = handlers;