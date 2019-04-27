//Allow for environment variable import
require('dotenv').config();

// --- Forum Requirements -----------------------
var	fs = require('fs'),
	path = require('path'),

	winston = require.main.require('winston'),
	Meta = require.main.require('./src/meta'),

	Emailer = {},
	Nodemailer = require("nodemailer"),
	server;

// --- Required dependencies --------------------
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

// --- Test OAuth2 parameters -------------------
// const clientId = process.env.CLIENT_ID;
// const clientSecret = process.env.CLIENT_SECRET;
// const redirectUrl = process.env.REDIRECT_URL;
// const refreshToken = process.env.REFRESH_TOKEN;

// --- Create OAuth2 client ---------------------
const oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

// --- Set OAuth2 refresh token -----------------
oauth2Client.setCredentials({
	refresh_token: refreshToken,
  });

Emailer.init = function(params, callback) {
	function render(req, res, next) {
		res.render('admin/plugins/emailer-gmail', {});
	}

	Meta.settings.get('gmail', function(err, settings) {
		if (!err && settings 
				 && settings.clientId 
				 && settings.clientSecret 
				 && settings.refreshToken 
				 && settings.fromAddress 
				 && settings.redirectUrl) {

			server = Nodemailer.createTransport({
				service: 'Gmail',
				auth: {
					type: 'OAuth2',
					user: settings.fromAddress,
					clientId: settings.clientId,
					clientSecret: settings.clientSecret,
					refreshToken: settings.refreshToken,
				},
			});
		} else {
			winston.error('[plugins/emailer-gmail] You must fill out this shit!');
		}
	});

	params.router.get('/admin/plugins/emailer-gmail', params.middleware.admin.buildHeader, render);
	params.router.get('/api/admin/plugins/emailer-gmail', render);

	callback();
};

// --- Send message -----------------------------
Emailer.send = function(data, callback) {
	if (!server) {
		winston.error('[emailer.gmail] Gmail is not set up properly!')
		return callback(null, data);
	}

	server.messages().send({
		to: data.to,
		subject: data.subject,
		from: data.from,
		html: data.html,
		text: data.plaintext
	}, function (err, body) {
		if (!err) {
			winston.verbose('[emailer.gmail] Sent `' + data.template + '` email to uid ' + data.uid);
		} else {
			winston.warn('[emailer.gmail] Unable to send `' + data.template + '` email to uid ' + data.uid + '!!');
			winston.error('[emailer.gmail] (' + err.message + ')');
		}

		return callback(err, data);
	});
};

// --- Include admin menu -----------------------
Emailer.admin = {
	menu: function(custom_header, callback) {
		custom_header.plugins.push({
			"route": '/plugins/emailer-gmail',
			"icon": 'fa-envelope-o',
			"name": 'Emailer (Gmail)'
		});

		callback(null, custom_header);
	}
};

module.exports = Emailer;