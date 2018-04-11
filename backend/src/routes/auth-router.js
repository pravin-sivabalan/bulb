let express = require('express')
let router = express.Router()
let User = require('../models/user-model');

router.post('/signup', (req, res) => {
    if(!req.body.first_name || !req.body.last_name || !req.body.email || !req.body.password) return res.sendStatus(400);
    let user = User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password
    });
    User.findOne({email: req.body.email}, (err, user) => {
        if(err) return res.status(500).send({message: 'MongoError'})
        if(user) return res.status(409).send({message: 'User already exists'});
        user.save((err, newUser) => {
          if(err) return res.status(500).send({message: 'MongoError'});
          return res.json({
            success: true,
            token: user.generateJWT()
          });
        });
    });
});

router.post('/login', (req, res) => {
  if(!req.body.email || !req.body.password) return res.sendStatus(400);
  User.findOne({email: req.body.email}, (err, user) => {
      if(err) return res.status(500).send({message: 'MongoError'})
      if(!user) return res.status(404).send({message: 'Email does not exist'});
      if(user.validatePassword(req.body.password)) {
        return res.json({
          success: true,
          token: user.generateJWT()
        });
      } else {
        return res.status(400).send({message: 'Invalid password'});
      }
  });
});

module.exports = router
