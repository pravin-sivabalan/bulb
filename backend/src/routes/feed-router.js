const { successRes, errorRes } = require('../utils');
const express = require('express')
const Idea = require('../models/idea-model');
const Authorized = require('../utilities/middleware');
const router = express.Router();

router.get('/', Authorized, (req, res) => {
  Idea.find()
    .populate('_user', ['_id', 'firstName', 'lastName', 'email'])
    .exec((err, ideas) => {
      if(err) return errorRes(500, 'MongoError');
      successRes(res, {ideas: ideas});
    });
});

module.exports = router;
