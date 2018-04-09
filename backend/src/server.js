let http = require('http');
let mongoose = require('mongoose');
let express = require('express');
let morgan = require('morgan');
let bodyParser = require('body-parser');
let cors = require('cors');
let jwt = require('express-jwt');
let fs = require('fs');
require('dotenv').config();

let auth = require('./routes/auth');

let app = module.export = express();
app.server = http.createServer(app);
mongoose.connect(process.env.DB, { useMongoClient: true });

app.use(cors());
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

app.use('/api/auth', auth);

app.server.listen(process.env.PORT, () => {
		console.log(`Started on port ${app.server.address().port}`);
});
