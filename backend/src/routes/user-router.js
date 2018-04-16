let express = require('express')
let router = express.Router()
let User = require('../models/user-model');
let Authorized = require('../utilities/middleware');
const { successRes, errorRes } = require('../utils');

router.get('/', (req, res) => {
    if (!req.query.id) return errorRes(res, 400, 'Must have an ID');
    User.findById(req.user.id, (err, user) => {
        res.json(user);
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
