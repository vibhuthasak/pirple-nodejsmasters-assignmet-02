// SubHandler file for 'pizza' route

const _data = require('../data');
const helpers = require('../helpers');
const {
  verifyToken
} = require('./tokens')

// Container for the pizza sub methods
_pizza = {};

// pizza - post
// Add pizza to the user cart - The cart is a item in the user's data
// Required data : email, pizzaId, pizza count, token from header
// Optional data: none
_pizza.post = function (data, callback) {
  // Validate payload
  var email = (typeof (data.payload.email) === 'string') && helpers.validateEmail(data.payload.email.trim()) ? data.payload.email.trim().toLowerCase() : false;
  var pizzaId = (typeof (data.payload.pizzaId) === 'number') && data.payload.pizzaId > 0 ? data.payload.pizzaId : false;
  var pizzaCount = (typeof (data.payload.pizzaCount) === 'number') && data.payload.pizzaCount > 0 ? data.payload.pizzaCount : false;

  if (email && pizzaId && pizzaCount) {
    // Get the token from the header
    var token = (typeof (data.headers.token) === 'string') ? data.headers.token : false;
    verifyToken(token, email, function (tokenIsValied) {
      if (tokenIsValied) {
        // Read the user data
        _data.read('users', email, function (err, userData) {
          if (!err && userData) {
            // Search PizzaId from the pizza menu
            _data.read('items', 'pizza', function (err, pizzaList) {
              if (!err && pizzaList) {
                // Checking pizza list to check weather id is valid
                if (helpers.IdIsValid(pizzaList, pizzaId)[0]) {
                  // Checking pizza if already on the user's cart
                  if (helpers.IdIsValid(userData.cart, pizzaId)[0]) {
                    // pizza id is already on the list
                    var index = helpers.IdIsValid(userData.cart, pizzaId)[1];
                    // Update pizzaCartObject location
                    var pizzaCartObject = {
                      'id': pizzaId,
                      'count': pizzaCount,
                      'price': pizzaCount * helpers.IdIsValid(pizzaList, pizzaId)[0]['price']
                    }
                    userData.cart[index] = pizzaCartObject;

                  } else {
                    // Append new pizza id and count to the user's cart list
                    var pizzaCartObject = {
                      'id': pizzaId,
                      'count': pizzaCount,
                      'price': pizzaCount * helpers.IdIsValid(pizzaList, pizzaId)[0]['price']
                    }
                    userData.cart.push(pizzaCartObject)
                  }
                  // Update user cart above value
                  _data.update('users', email, userData, function (err) {
                    if (!err) {
                      callback(200, {
                        'Status': 'Cart updated'
                      })
                    } else {
                      callback(500, {
                        'Error': 'User update error'
                      })
                    }
                  });

                } else {
                  callback(400, {
                    'Error': 'Pizza ID not found'
                  })
                }
              } else {
                callback(500, {
                  'Error': 'Could not find pizza'
                });
              }
            });
          } else {
            callback(500, {
              'Error': 'Read userdata'
            })
          }
        });
      } else {
        callback(403, {
          'Error': 'Invalid Token'
        });
      }
    })
  } else {
    callback(400, {
      'Error': 'Missing required field'
    });
  }
};

// pizza - get
// Get all available pizza from the menu
// Required : email, (token from header)
_pizza.get = function (data, callback) {
  var email = typeof (data.query.email) === 'string' && helpers.validateEmail(data.query.email.trim()) ? data.query.email.trim().toLowerCase() : false;
  if (email) {
    // Get the token from the header
    var token = (typeof (data.headers.token) === 'string') ? data.headers.token : false;
    verifyToken(token, email, function (tokenIsValied) {
      if (tokenIsValied) {
        // Lookup the pizza.json on the item
        _data.read('items', 'pizza', function (err, pizzaList) {
          if (!err && pizzaList) {
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
// Required data : email, (token from header), PizzaId, count
_pizza.put = function (data, callback) {
  // PUT Doesn't needed
};

// pizza - delete
// Delete item in the cart of the user
// Required fields : email, pizzaid, token from header
_pizza.delete = function (data, callback) {
   // Validate payload
   var email = (typeof (data.query.email) === 'string') && helpers.validateEmail(data.query.email.trim()) ? data.query.email.trim().toLowerCase() : false;
   var pizzaId = (typeof (data.query.pizzaId) === 'string') && data.query.pizzaId > 0 ? data.query.pizzaId : false;

   if(email && pizzaId){
    // Get the token from the header and validate it
    var token = (typeof (data.headers.token) === 'string') ? data.headers.token : false;
    verifyToken(token, email, function (tokenIsValied) {
      if (tokenIsValied) {
        // Find the user using the email
        _data.read('users', email, function(err, userData){
          if(!err && userData){
            // Checking pizzaid if already on the user's cart
            [userCart, index] = helpers.IdIsValid(userData.cart, pizzaId)
            if (userCart) {
              // Clear the cart item using the index 
              userData.cart.splice(index, 1);
              _data.update('users', email, userData, function(err){
                if(!err){
                  callback(200, {
                    'Status': 'Cart item cleared'
                  })
                } else {
                  callback(500, {
                    'Error': 'User data update error'
                  })
                }
              });
            } else {
              callback(400, {
                'Error': 'User Cart Empty'
              })
            }
          } else {
            callback(400, {
              'Error': 'Cannot find the user'
            })
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
       'Error': 'Invalid parameters'
     })
   }
};

module.exports = _pizza;