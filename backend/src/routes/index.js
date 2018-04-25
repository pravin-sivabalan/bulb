const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('express-jwt');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors());

app.use(
	jwt({
		secret: process.env.SECRET,
		credentialsRequired: false,
		getToken: req => {
			if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
				return req.headers.authorization.split(' ')[1];
			else if (req.query && req.query.token) return req.query.token;
			return null;
		},
	})
);

app.use('/api/auth', require('./auth-router'));
app.use('/api/users', require('./user-router'));
app.use('/api/ideas', require('./idea-router'));

module.exports = app;
