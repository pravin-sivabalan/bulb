let express = require('express');
let app = express();
let morgan = require('morgan');
let bodyParser = require('body-parser');
let session = require('express-session');
let MongoDBStore = require('connect-mongodb-session')(session);
let jwt = require('express-jwt');
let store = new MongoDBStore({ uri: process.env.DB, collection: 'mySessions' });

app.use(morgan('dev'));
app.use(bodyParser.json());

app.use(jwt({
  secret: process.env.SECRET,
  credentialsRequired: false,
  getToken: (req) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
  }
}));

app.use('/api/auth', require('./auth-router'));

module.exports = app;
