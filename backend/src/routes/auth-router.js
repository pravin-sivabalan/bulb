let express = require('express')
let router = express.Router()
let User = require('../models/user-model');

router.post('/signup', (req, res) => {
    if(!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password) return res.sendStatus(400);
    let user = User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password
    });
    user.save((err, newUser) => {
      if(err) return res.status(500).send({message: 'MongoError'})
      req.user = newUser;
      return res.json({success: true});
    });
});

router.post('/login', (req, res) => {
  if(!req.body.email || !req.body.password) return res.sendStatus(400);
  User.findOne({email: req.body.email}, (err, user) => {
      if(err) return res.status(500).send({message: 'MongoError'})
      if(!user) return res.status(404).send({message: 'Email does not exist'});
      if(user.validatePassword(req.body.password)) {
        req.user = user;
        return res.json({success: true});
      } else {
        return res.status(400).send({message: 'Invalid password'});
      }
  });
});

module.exports = router
