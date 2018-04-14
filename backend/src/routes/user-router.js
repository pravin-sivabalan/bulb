let express = require('express')
let router = express.Router()
let User = require('../models/user-model');
let Authorized = require('../utilities/middleware');

router.get('/', Authorized, (req, res) => {
    console.log(req.user);
    User.findById(req.user.id, (err, user) => {
        res.json(user);
    });
});

module.exports = router
