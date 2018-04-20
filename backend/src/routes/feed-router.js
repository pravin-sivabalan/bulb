const { successRes, errorRes } = require('../utils');
const express = require('express');
const Idea = require('../models/idea-model');
const Authorized = require('../utils/middleware');
const router = express.Router();

router.get('/', Authorized, (req, res) => {
  let query = {}; // Global feed

  if (req.query.type == 0) {
    // TODO: add friends
  } else if (req.query.type == 1) {
    query._user = req.user.id; // Personal feed
  }

  Idea.find(query)
    .populate('_user', ['_id', 'firstName', 'lastName', 'email'])
    .exec((err, ideas) => {
      if (err) return errorRes(500, 'MongoError');
      successRes(res, { ideas: ideas });
    });
});

module.exports = router;
