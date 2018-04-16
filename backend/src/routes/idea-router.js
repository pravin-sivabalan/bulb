const { successRes, errorRes } = require('../utils');
const express = require('express')
const Idea = require('../models/idea-model');
const Authorized = require('../utilities/middleware');
const router = express.Router();

router.post('/', Authorized, (req, res) => {
  if(!req.body.title) return errorRes(res, 400, 'Idea must have a title');
  if(!req.body.description) return errorRes(res, 400, 'Idea must have a description');

  const idea = Idea({
    _user: req.user.id,
    title: req.body.title,
    description: req.body.description
  });

  idea.save((err, newIdea) => {
    if(err) return errorRes(res, 500, 'MongoError');
    return successRes(res, {
      idea: newIdea
    });
  });

});

module.exports = router;
