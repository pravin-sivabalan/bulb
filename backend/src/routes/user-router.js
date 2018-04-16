let express = require('express')
let router = express.Router()
let User = require('../models/user-model');
let Authorized = require('../utilities/middleware');
const { successRes, errorRes } = require('../utils');

router.get('/:id', (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if (!user) return errorRes(res, 404, 'User not found');
        return successRes(res, {
            user
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

        user.save((err) => {
          if (err) {
            return errorRes(res, 500, 'Mongo Error');
          } else {
            return successRes(res, {
              user,
              token: user.generateJWT()
            });
          }
        });
    });
});

function isEditable(property) {
    editable = ['firstName', 'lastName', 'email', 'password'];

    return editable.includes(property);
}

module.exports = router
