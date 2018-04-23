let express = require('express');
let router = express.Router();
let User = require('../models/user-model');
let Authorized = require('../utils/middleware');
const { successRes, errorRes } = require('../utils');

router.post('/request', Authorized, (req, res) => {
  if (!req.body.friendId) return errorRes(res, 400, 'friendId field is missing');

  User.findById(req.user.id, (err, user) => {
    if (err) return errorRes(res, 500, 'MongoError');
    if (!user) return errorRes(res, 404, 'User does not exist');

    User.findById(req.body.friendId, (err, friend) => {
      if (err) return errorRes(res, 500, 'MongoError');
      if (!friend) return errorRes(res, 404, 'Friend does not exist');
      if(friend.friendRequests.indexOf(user._id) > -1) return errorRes(res, 409, 'Friend request already sent');

      friend.friendRequests.push(user._id);
      friend.save((err, updatedFriend) => {
        if (err) return errorRes(res, 500, 'MongoError');
        return successRes(res, 'Successfully added friend request');
      });
    });
  });
});

router.post('/accept', Authorized, (req, res) => {
  if (!req.body.friendId) return errorRes(res, 400, 'friendId field is missing');

  User.findById(req.user.id, (err, user) => {
    if (err) return errorRes(res, 500, 'MongoError');
    if (!user) return errorRes(res, 404, 'User does not exist');

    User.findById(req.body.friendId, (err, friend) => {
      if (err) return errorRes(res, 500, 'MongoError');
      if (!friend) return errorRes(res, 404, 'Friend does not exist');

      let index = user.friendRequests.indexOf(friend._id);
      if (index > -1) {
        user.friendRequests.splice(index, 1);
      } else {
        return errorRes(res, 404, 'Friend request not found');
      }
      friend.friends.push(user._id);
      user.friends.push(friend._id);
      user.save((err, updatedUser) => {
        if (err) return errorRes(res, 500, 'MongoError');
        friend.save((err, updatedFriend) => {
          if (err) return errorRes(res, 500, 'MongoError');
          return successRes(res, 'Successfully added friend');
        });
      });
    });
  });
});

module.exports = router;
