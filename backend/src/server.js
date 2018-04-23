const http = require('http');
const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
require('dotenv').config();

const app = require('./routes/index');
mongoose.Promise = Promise;

app.server = http.createServer(app);
mongoose.connect(process.env.DB, { useMongoClient: true });

// Serves react app, only used in production
if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, '../../frontend/build')));
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, '../../frontend/build/index.html'));
	});
}

app.server.listen(process.env.PORT, () => {
	console.log(`Started on port ${app.server.address().port}`);
});
