let express = require('express')
let router = express.Router()
let User = require('../models/user');

router.post('/signup', (req, res) => {
    let newUser = User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password
    });
    newUser.save((err) => {
      if(err) return res.json({success: false});
      return res.json({success: true});
    });
});

router.post('/login', (req, res) => {
  User.findOne({email: req.body.email }, (err, user) => {
      if(!user || err) return res.json({success: false});
      if(user.validatePassword(req.body.password)) {
          return res.json({
            success: true,
            token: user.generateJWT()
          });
      } else {
        res.json({success: false});
      }
  });
});

module.exports = router
