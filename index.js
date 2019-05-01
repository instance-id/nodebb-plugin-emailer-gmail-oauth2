var	fs = require('fs'),
	path = require('path'),

	winston = require.main.require('winston'),
	Meta = require.main.require('./src/meta'),

	Emailer = {},
	Nodemailer = require("nodemailer"),
	server;

// --- OAuth2 parameters -------------------
var clientId;
var clientSecret;
var redirectUrl;
var refreshToken;
var fromAddress;

// --- Getting settings for Oauth2 --------------
Meta.settings.get('gmail-oauth2', function(err, settings) {
	clientId = settings.clientId;
	clientSecret = settings.clientSecret; 
	redirectUrl = settings.redirectUrl;
	refreshToken = settings.refreshToken;
	console.log('TEST : clientId from settings: ' + clientId);
});

// --- Required dependencies --------------------
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

// --- Create OAuth2 client ---------------------
const oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

// --- Set OAuth2 refresh token -----------------
oauth2Client.setCredentials({
	refresh_token: refreshToken,
  });

Emailer.init = function(params, callback) {
	function render(req, res, next) {
		res.render('admin/plugins/emailer-gmail-oauth2', {});
	}

	Meta.settings.get('gmail-oauth2', function(err, settings) {
		if (!err && settings 
				 && settings.clientId 
				 && settings.clientSecret
				 && settings.refreshToken ) {
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
			winston.error('[plugins/emailer-gmail-oauth2] You must fill in all fields on the Plugins -> Emailer(Gmail-Oauth2) page!');
		}
	});
	params.router.get('/admin/plugins/emailer-gmail-oauth2', params.middleware.admin.buildHeader, render);
	params.router.get('/api/admin/plugins/emailer-gmail-oauth2', render);

	callback();
};

// --- Send message -----------------------------
Emailer.send = function(data, callback) {
	if (!server) {
		winston.error('[emailer.gmail-oauth2] Gmail-oauth is not set up properly!')
		return callback(null, data);
	}

	// server.messages().send({
	server.sendMail({
		to: data.to,
		subject: data.subject,
		from: data.from,
		html: data.html,
		text: data.plaintext
	}, function (err, body) {
		if (!err) {
			winston.verbose('[emailer.gmail-oauth2] Sent `' + data.template + '` email to uid ' + data.uid);
		} else {
			winston.warn('[emailer.gmail-oauth2] Unable to send `' + data.template + '` email to uid ' + data.uid + '!!');
			winston.error('[emailer.gmail-oauth2] (' + err.message + ')');
		}

		return callback(err, data);
	});
};

// --- Include admin menu -----------------------
Emailer.admin = {
	menu: function(custom_header, callback) {
		custom_header.plugins.push({
			"route": '/plugins/emailer-gmail-oauth2',
			"icon": 'fa-envelope-o',
			"name": 'Emailer (Gmail-Oauth2)'
		});

		callback(null, custom_header);
	}
};

module.exports = Emailer;
