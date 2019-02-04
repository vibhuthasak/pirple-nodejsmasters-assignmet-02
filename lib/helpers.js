// Helpers for various tasks

// Dependencies
const crypto = require('crypto');
const config = require('../config');
const queryString = require('querystring');
const https = require('https');

// Container for all helpers file
var helpers = {};

// helpers.hash
helpers.hash = function (str) {
	if (typeof (str) === 'string' && str.length > 0) {
		return crypto.createHash('sha256', config.hashingSecret).update(str).digest('hex');
	} else {
		return false;
	}
};

// helpers.parseJsonToObject
// Parse a JSON string to an object in all cases, without throwing a error
helpers.parseJsonToObject = function (str) {
	try {
		return JSON.parse(str);
	} catch (e) {
		return {}
	}
};

// create random string of x length
helpers.createRandomString = function (strLength) {
	strLength = typeof (strLength) === 'number' && strLength > 0 ? strLength : false;
	if (strLength) {
		var possibleChars = 'abcdefghijklmnopqrstuvwxyz0123456789';

		// Start of the final string
		var str = '';

		for (i = 1; i <= strLength; i++) {
			// get a random char from possibleChars 
			var randomCharactor = possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
			// append randomCharactor to str
			str += randomCharactor;
		}
		// Output the str
		return str;
	} else {
		return false;
	}
};

// Stripe payment handler for cart checkouts
// Required: amount, currency, source, description, token
helpers.stripeCheckOut = function (clientToken, amount, callback) {
	if (clientToken && amount) {
		// Config the Stripe payload
		var payload = {
			"amount": amount,
			"currency": 'usd',
			"description": 'Pizza payments',
			"source": clientToken
		}
		// Stringify the payload
		var stringPayload = queryString.stringify(payload);

		// Configure the request details
		var requestDetails = {
			'protocol': 'https:',
			'hostname': 'api.stripe.com',
			'method': 'POST',
			'path': '/v1/charges',
			'headers': {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': Buffer.byteLength(stringPayload),
				'Authorization': 'Bearer ' + config.stripeSkey
			}
		}

		// Initiate the request object
		var req = https.request(requestDetails, function (res) {
			// Grab the status code of the request
			var statusCode = res.statusCode;
			if (statusCode === 200 | statusCode === 201) {
				callback(false);
			} else {
				callback(statusCode);
			}
		});

		// Bind to the error event
		req.on('error', function (error) {
			callback(error);
		});

		// Add the payload
		req.write(stringPayload);

		// End the request
		req.end();

	} else {
		callback(400)
	}
}

// Mailgun email handler for Notify customers about the payment
helpers.sendMailGun = function(senderMail, text, callback){
	if (senderMail) {
		// Config the Stripe payload
		var payload = {
			"from": "postmaster@sandboxb12e344f796d494abd5f1b0e4feafe2a.mailgun.org",
			"to": senderMail,
			"subject": "Pizza APP payment succeed",
			"text": text
		}
		// Stringify the payload
		var stringPayload = queryString.stringify(payload);

		// Configure the request details
		var requestDetails = {
			'protocol': 'https:',
			'hostname': 'api.mailgun.net',
			'method': 'POST',
			'path': '/v3/sandboxb12e344f796d494abd5f1b0e4feafe2a.mailgun.org/messages',
			'headers': {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': Buffer.byteLength(stringPayload),
				'Authorization': 'Basic ' + Buffer.from(config.mailgun.username + ':' + config.mailgun.password).toString('base64')
			}
		}

		// Initiate the request object
		var req = https.request(requestDetails, function (res) {
			// Grab the status code of the request
			var statusCode = res.statusCode;
			if (statusCode === 200 | statusCode === 201) {
				callback(false);
			} else {
				callback(statusCode);
			}
		});

		// Bind to the error event
		req.on('error', function (error) {
			callback(error);
		});

		// Add the payload
		req.write(stringPayload);

		// End the request
		req.end();

	} else {
		callback(400)
	}	
}

// Verify Email
// Check whether Email in properly formatted
helpers.validateEmail = function (checkEmail) {
	const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	return re.test(checkEmail.toLowerCase());
}

// Looping through list to check weather id is valid
helpers.IdIsValid = function (List, Id) {
	if (List.length === 0) {
		return [false, 0];
	}
	for (let i = 0; i < List.length; i++) {
		if (List[i]['id'] == Id) {
			return [List[i], i];
		}
		if (i === List.length - 1) {
			return [false, 0];
		}
	}
}
// Exporting the module
module.exports = helpers;