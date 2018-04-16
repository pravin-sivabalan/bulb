const { successRes, errorRes } = require('../utils');
const express = require('express')
const Idea = require('../models/idea-model');
const Authorized = require('../utils/middleware');
const router = express.Router();

router.get('/:id', Authorized, (req, res) => {
  Idea.findById(req.params.id, (err, idea) => {
      if(err) return errorRes(res, 500, 'MongoError');
      if(!idea) return errorRes(res, 404, 'Idea not found');
      return successRes(res, {
        idea: idea
      });
  });
});

router.delete('/:id', Authorized, (req, res) => {
  Idea.findById(req.params.id, (err, idea) => {
      if(err) return errorRes(res, 500, 'MongoError');
      if(!idea) return errorRes(res, 404, 'Idea not found');
      if(req.user.id != idea._user) return errorRes(res, 401, 'User is unauthorized to delete this idea');
      Idea.findByIdAndRemove(req.params.id, (err, idea) => {
        if(err) return errorRes(res, 500, 'MongoError');
        return successRes(res, 'Successfully deleted idea');
      });
  });
});

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
