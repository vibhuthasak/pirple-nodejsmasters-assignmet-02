// SubHandler file for 'pizza' route

const _data = require('../data');
const helpers = require('../helpers');
const {verifyToken} = require('./tokens')

// Container for the pizza sub methods
_pizza = {};

// pizza - post
// Add pizza to the user cart - The cart is a item in the user's data
// Required data : email, pizzaid, pizza count, token from header
// Optional data: none
_pizza.post = function (data, callback) {
};

// pizza - get
// Get all available pizza from the menu
// Required : email, (token from header)
_pizza.get = function (data, callback) {
  var email = typeof (data.query.email) === 'string' && helpers.validateEmail(data.query.email.trim()) ? data.query.email.trim().toLowerCase() : false;
  if (email){
    // Get the token from the header
    var token = (typeof (data.headers.token) === 'string') ? data.headers.token : false;
    verifyToken(token, email, function(tokenIsValied){
      if(tokenIsValied){
        // Lookup the pizza.json on the item
        _data.read('items', 'pizza', function(err, pizzaList){
          if(!err && pizzaList){
            callback(200, pizzaList);
          } else {
            callback(500, {
              'Error': 'Could not find items'
            });
          }
        });
      } else {
        callback(403, {
          'Error': 'Invalid Token'
        });
      }
    });
  } else {
    callback(400, {
      'Error': 'Missing required field'
    });
  }
};

// pizza - put
// Edit the cart of the user
// Required data : email, (token from header)
// Optional data : firstName, LastName, password
_pizza.put = function (data, callback) {
};

// pizza - delete
// Delete item in the cart of the user
// Required fields : email, pizzaid, token from header
_pizza.delete = function (data, callback) {
};

module.exports = _pizza;