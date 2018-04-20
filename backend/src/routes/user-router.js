let express = require('express');
let router = express.Router();
let User = require('../models/user-model');
let Authorized = require('../utils/middleware');
const { successRes, errorRes } = require('../utils');
const Idea = require('../models/idea-model');

/*
* BUG: Even if I am deleted as a user I can post ideas and can get "deleted" multiple times
*      ^ probably due to JWT still being active and valid
*/

router.get('/:id', (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (!user) return errorRes(res, 404, 'User not found');
    return successRes(res, {
      user,
    });
  });
});

router.put('/', Authorized, (req, res) => {
  User.findById(req.user.id, (err, user) => {
    if (req.body.password && isEditable('password')) {
      if (!user.updatePassword(req.body.password)) {
        return errorRes(res, 400, 'New password cannot match old password');
      }
    }

    for (key in req.body) {
      if (isEditable(key)) {
        user[key] = req.body[key];
      }
    }

    user.save(err => {
      if (err) {
        return errorRes(res, 500, 'Mongo Error');
      } else {
        return successRes(res, {
          user,
          token: user.generateJWT(),
        });
      }
    });
  });
});

router.delete('/', Authorized, (req, res) => {
  User.findByIdAndRemove(req.user.id, (err, user) => {
    if (err) return errorRes(res, 404, 'Error removing user');

    if (!user) return errorRes(res, 404, "User doesn't exist");

    console.log(user);
    return successRes(res);
  });

  Idea.find({ _user: req.user.id }, (err, ideas) => {
    if (err) return errorRes(res, 404, 'Error finding ideas');

    if (!ideas) return errorRes(res, 404, 'No ideas for user');

    ideas.forEach(idea => {
      idea.remove();
    });
  });
});

function isEditable(property) {
  editable = ['firstName', 'lastName', 'email', 'password'];

  return editable.includes(property);
}

module.exports = router;
