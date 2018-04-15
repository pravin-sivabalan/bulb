const express = require('express')
const User = require('../models/user-model');
const { successRes, errorRes } = require('../utils');
const router = express.Router();

router.post('/signup', (req, res) => {
  if (!req.body.firstName) return errorRes(res, 400, 'User must have a first name');
  if (!req.body.lastName) return errorRes(res, 400, 'User must have a last name');
  if (!req.body.email) return errorRes(res, 400, 'User must have an email');
  if (!req.body.password) return errorRes(res, 400, 'User must have a password');

  const user = User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password
  });

  User.findOne({email: req.body.email}, (err, existingUser) => {
    if(err == 'null') return errorRes(res, 500, 'MongoError');
    if(existingUser) return errorRes(res, 409, 'User already exists');
    user.save((err, newUser) => {
      if(err) return errorRes(res, 500, 'MongoError');
      return successRes(res, {
        user: newUser,
        token: user.generateJWT()
      });
    });
  });
});

router.post('/login', (req, res) => {
  if (!req.body.email) return errorRes(res, 400, 'User must have an email');
  if (!req.body.password) return errorRes(res, 400, 'User must have a password');
  User.findOne({email: req.body.email}, (err, user) => {
      if(err) return errorRes(res, 500, 'MongoError');
      if(!user) return errorRes(res, 404, 'Email does not exist');
      if(user.validatePassword(req.body.password)) {
        return successRes(res, {
          user,
          token: user.generateJWT()
        });
      } else {
        return errorRes(res, 400, 'Invalid password');
      }
  });
});

module.exports = router;