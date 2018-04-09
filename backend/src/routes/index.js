let express = require('express');
let app = express();
let morgan = require('morgan');
let bodyParser = require('body-parser');
let session = require('express-session');
let MongoDBStore = require('connect-mongodb-session')(session);
let store = new MongoDBStore({ uri: process.env.DB, collection: 'mySessions' });

app.use(morgan('dev'));
app.use(bodyParser.json());

app.use(require('express-session')({
  secret: 'SessionSecret',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  },
  store: store,
  resave: true,
  saveUninitialized: true
}));

app.use('/api/auth', require('./auth-router'));

module.exports = app;
