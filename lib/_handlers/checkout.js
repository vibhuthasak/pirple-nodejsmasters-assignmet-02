// SubHandler file for 'checkout' route

const _data = require('../data');
const helpers = require('../helpers');
const {
  verifyToken
} = require('./tokens');

// Container for the checkout sub methods
_checkout = {};

// checkout - post
// checkout user's cart
// Required data : email, Stripetoken, token from header
// Optional data: none
_checkout.post = function (data, callback) {
  // Validate payload
  var email = (typeof (data.payload.email) === 'string') && helpers.validateEmail(data.payload.email.trim()) ? data.payload.email.trim().toLowerCase() : false;
  var stripeToken = (typeof (data.payload.stripeToken) === 'string') ? data.payload.stripeToken : false;
  if (email && stripeToken) {
    // Get the token from the header
    var token = (typeof (data.headers.token) === 'string') ? data.headers.token : false;
    verifyToken(token, email, function (tokenIsValied) {
      if (tokenIsValied) {
        // Read the user and Get the user cart
        _data.read('users', email, function (err, userData) {
          if (!err && userData) {
            var userCart = userData.cart;
            if (userCart.length > 0) {
              // Get the items in the cart and checkout
              var totalprice = 0;
              var emailText = "";
              userCart.forEach(cartItem => {
                totalprice += cartItem.price;
                emailText += cartItem.name + ' x' + cartItem.count + ' = ' + cartItem.price + '\n'
              });
              // Stripe payments
              helpers.stripeCheckOut(stripeToken, totalprice, function (err) {
                if (!err) {
                  // Payment is success, Now send the email to the Client regarding the transaction
                  helpers.sendMailGun(email, emailText, function (err) {
                    if (!err) {
                      callback(200, {
                        'Status': 'Payment Success'
                      })
                    } else {
                      callback(400, {
                        'Error': 'Email Sending failed'
                      })
                    }
                  })
                } else {
                  callback(400, {
                    'Error': 'Stripe Payment Error'
                  })
                }
              })
            } else {
              callback(404, {
                'Error': 'User cart not found'
              })
            }
          } else {
            callback(404, {
              'Error': 'User data not found'
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
      'Error': 'Missing parameters'
    });
  }
};

module.exports = _checkout;