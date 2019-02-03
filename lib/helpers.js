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
		
		for (i=1; i <= strLength; i++) {
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

// Send an SMS via twilio
helpers.sendTwilioSMS = function (phone, msg, callback) {
	// Validate parameters
	phone = typeof(phone) === 'string' && phone.trim().length === 10 ? phone.trim() : false;
	msg = typeof(msg) === 'string' && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg.trim() : false;

	if (phone && msg) {
		// Config the twilio payload
		var payload = {
			'From': config.twilio.fromPhone,
			'To': '+94'+phone,
			'Body': msg
		}
		// Stringify the payload
		var stringPayload = queryString.stringify(payload);

		// Configure the request details
		var requestDetails = {
			'protocol': 'https:',
			'hostname': 'api.twilio.com',
			'method': 'POST',
			'path': '/2010-04-01/Accounts/'+config.twilio.accountSid+'/Messages.json',
			'auth': config.twilio.accountSid+':'+config.twilio.authToken,
			'headers': {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': Buffer.byteLength(stringPayload)
			}
		}

		// Initiate the request object
		var req = https.request(requestDetails, function(res){
			// Grab the status code of the request
			var statusCode = res.statusCode;
			if (statusCode === 200 | statusCode === 201){
				callback(false);
			} else {
				callback('Returned Status Code : ' + statusCode);
			}
		});

		// Bind to the error event
		req.on('error', function(error){
			callback(error);
		});

		// Add the payload
		req.write(stringPayload);

		// End the requrest
		req.end();

	} else {
		callback('Given paramters were missing or invalid')
	}
}

// Exporting the module
module.exports = helpers;