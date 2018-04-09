let express = require('express');
let app = express();
let morgan = require('morgan');
let bodyParser = require('body-parser');
let path = require('path');
let jwt = require('express-jwt');


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

if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../../frontend/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../../frontend/build/index.html'));
  });
}


module.exports = app;
