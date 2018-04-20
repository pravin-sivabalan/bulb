let jwt = require('express-jwt');
let Authorized = jwt({ secret: process.env.SECRET, userProperty: 'payload' });
module.exports = Authorized;
