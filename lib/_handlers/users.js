// SubHandler file for 'users' route

const _data = require('../data');
const helpers = require('../helpers');
const {verifyToken} = require('./tokens')

// Container for the users sub methods
_users = {};

// users - post
// Required data : firstName, lastName, email, password, tosAgreement
// Optional data: none
_users.post = function (data, callback) {
  var firstName = (typeof (data.payload.firstName) === 'string') && (data.payload.firstName.trim().length > 0) ? data.payload.firstName.trim() : false;
  var lastName = (typeof (data.payload.lastName) === 'string') && (data.payload.lastName.trim().length > 0) ? data.payload.lastName.trim() : false;
  var email = (typeof(data.payload.email) === 'string') && helpers.validateEmail(data.payload.email.trim()) ? data.payload.email.trim().toLowerCase() : false;
  var password = (typeof (data.payload.password) === 'string') && (data.payload.password.trim().length > 0) ? data.payload.password.trim() : false;
  var tosAgreement = (typeof (data.payload.tosAgreement) === 'boolean') && (data.payload.tosAgreement === true);

  if (firstName && lastName && email && password && tosAgreement) {
    // Make sure the user doesn't already exist
    _data.read('users', email, function (err, data) {
      if (err) {
        // An error means file not found, Ready to add the user
        // First password need to be hashed before save
        let hashedPassword = helpers.hash(password);

        // Creating the user object
        var userObject = {
          'firstName': firstName,
          'lastName': lastName,
          'email': email,
          'password': hashedPassword,
          'tosAgreement': true
        };

        // Store the user
        _data.create('users', email, userObject, function (err) {
          if (!err) {
            callback(200);
          } else {
            callback(500, {
              'Error': 'Could not create the new user'
            });
          }
        });

      } else {
        // user already exists
        callback(400, {
          'Error': 'A user is already exists'
        });
      }
    });
  } else {
    callback(400, {
      'Error': 'Missing required fields'
    })
  }
};

// users - get
// Required : email, (token from header)
// Optional : None
_users.get = function (data, callback) {
  var email = typeof (data.query.email) === 'string' && helpers.validateEmail(data.query.email.trim()) ? data.query.email.trim().toLowerCase() : false;
  if (email) {
    // Get the token from the header
    var token = (typeof (data.headers.token) === 'string') ? data.headers.token : false;
    // Verify the token
    verifyToken(token, email, function (tokenIsValied) {
      if (tokenIsValied) {
        // Lookup the user
        _data.read('users', email, function (err, data) {
          if (!err && data) {
            // Remove the hashed password
            delete data.password;
            callback(200, data);
          } else {
            callback(404);
          }
        });
      } else {
        callback(403, {
          'Error': 'Invalid token'
        });
      }
    });
  } else {
    callback(400, {
      'Error': 'Missing required field'
    });
  }
};

// users - put
// Required data : email, (token from header)
// Optional data : firstName, LastName, password
_users.put = function (data, callback) {
  // Check for the required field
  var email = (typeof(data.payload.email) === 'string') && helpers.validateEmail(data.payload.email.trim()) ? data.payload.email.trim().toLowerCase() : false;

  // Check for the optional fields
  var firstName = (typeof (data.payload.firstName) === 'string') && (data.payload.firstName.trim().length > 0) ? data.payload.firstName.trim() : false;
  var lastName = (typeof (data.payload.lastName) === 'string') && (data.payload.lastName.trim().length > 0) ? data.payload.lastName.trim() : false;
  var password = (typeof (data.payload.password) === 'string') && (data.payload.password.trim().length > 0) ? data.payload.password.trim() : false;

  if (email) {
    if (firstName || lastName || password) {
      // Get the token from the header
      var token = (typeof (data.headers.token) === 'string') ? data.headers.token : false;
      // Verify the token
      verifyToken(token, email, function (tokenIsValied) {
        if (tokenIsValied) {
          _data.read('users', email, function (err, userData) {
            if (!err && userData) {
              if (firstName) {
                userData.firstName = firstName;
              }

              if (lastName) {
                userData.lastName = lastName;
              }

              if (password) {
                userData.password = helpers.hash(password);
              }

              // Store the new updates

              _data.update('users', email, userData, function (err) {
                if (!err) {
                  callback(200);
                } else {
                  console.log(err);
                  callback(500, {
                    'Error': 'Server Error'
                  })
                }
              });
            } else {
              callback(400, {
                'Error': 'User is not exist'
              });
            }
          });
        } else {
          callback(403, {
            'Error': 'Invalid token'
          });
        }
      });
    } else {
      callback(400, {
        'Error': 'Missing required fields'
      });
    }
  } else {
    callback(400, {
      'Error': 'Missing required fields'
    });
  }
};

// users - delete
// Required fields : email
_users.delete = function (data, callback) {
  var email = typeof (data.query.email) === 'string' && helpers.validateEmail(data.query.email.trim()) ? data.query.email.trim().toLowerCase() : false;
  if (email) {
    // Get the token from the header
    var token = (typeof (data.headers.token) === 'string') ? data.headers.token : false;
    // Verify the token
    verifyToken(token, email, function (tokenIsValied) {
      if (tokenIsValied) {
        // Lookup the user
        _data.read('users', email, function (err, userData) {
          if (!err && userData) {
            //Remove the user
            _data.delete('users', email, function (err) {
              if (!err) {
                  callback(200);
              } else {
                callback(500, {
                  'Error': 'Server Error'
                });
              }
            });
          } else {
            callback(400, {
              'Error': 'Could not find the user'
            });
          }
        });
      } else {
        callback(403, {
          'Error': 'Invalid token'
        });
      }
    });
  } else {
    callback(400, {
      'Error': 'Missing required field'
    });
  }
};

module.exports = _users;