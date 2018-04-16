let express = require('express')
let router = express.Router()
let User = require('../models/user-model');
let Authorized = require('../utils/middleware');

router.get('/', Authorized, (req, res) => {
    User.findById(req.user.id, (err, user) => {
        res.json(user);
    });
});

module.exports = router
