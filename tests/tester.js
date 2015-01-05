"use strict";

var express = require('express');
var bodyParser = require('body-parser');
var testerInitializer = require('./../tester');



// test server
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get('/hello/world', function (req, res) {
	res.status(200).send("ok1");
});
app.post('/hello/world', function (req, res, next) {
	res.status(201).send("ok2" + " " + req.body);
});



// tester
var tester = testerInitializer();
module.exports['express'] = {

	'get': tester(app, {
		method: 'GET',
		uri: '/hello/world',
		expect: {
			statusCode: 200,
			body: 'ok1'
		}
	}),

	'post': tester(app, {
		uri: '/hello/world',
		method: 'POST',
		body: ["hello"],
		expect: {
			statusCode: 201,
			body: 'ok2 hello'
		}
	})

};
