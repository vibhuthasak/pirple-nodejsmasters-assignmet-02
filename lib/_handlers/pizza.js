// SubHandler file for 'pizza' route

const _data = require('../data');
const helpers = require('../helpers');
const {verifyToken} = require('./tokens')

// Container for the pizza sub methods
_pizza = {};

// pizza - post
// Required data : email, pizzaid, pizza count, token from header
// Optional data: none
_pizza.post = function (data, callback) {
};

// pizza - get
// Required : email, (token from header), pizzaid
// Optional : count
_pizza.get = function (data, callback) {
};

// pizza - put
// Required data : email, (token from header)
// Optional data : firstName, LastName, password
_pizza.put = function (data, callback) {
};

// pizza - delete
// Required fields : email, pizzaid, token from header
_pizza.delete = function (data, callback) {
};

module.exports = _pizza;