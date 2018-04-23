let express = require('express');
let router = express.Router();
let User = require('../models/user-model');
let Authorized = require('../utils/middleware');
const { successRes, errorRes, isEditable } = require('../utils');
const Idea = require('../models/idea-model');

/*
* BUG: Even if I am deleted as a user I can post ideas and can get "deleted" multiple times
*      ^ probably due to JWT still being active and valid
*/

router.get('/:id', async (req, res) => {
	try {
		const user = await User.findById(req.params.id).exec();
		if (!user) return errorRes(res, 404, 'User not found');	
		return successRes(res, user);
	} catch (error) {
		return errorRes(res, 500, error);
	}
});

router.put('/', Authorized, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).exec();
		if (req.body.password && isEditable('password') && !user.updatePassword(req.body.password)) 
			return errorRes(res, 400, 'New password cannot match old password');

		for (let key in req.body) {
			if (isEditable(key))
				user[key] = req.body[key];
		}

		const newUser = await user.save();
		return successRes(res, {
			newUser,
			token: user.generateJWT(),
		});
	} catch (error) {
		return errorRes(res, 500, error);
	}
});

router.delete('/', Authorized, async (req, res) => {
	try {
		const user = await User.findByIdAndRemove(req.user.id).exec();
		if (!user) return errorRes(res, 404, 'User doesn\'t exist');
		const ideas = await Idea.find({ _user: req.user.id }).exec();
		ideas.forEach(idea => idea.remove());
		return successRes(res);
	} catch (error) {
		return errorRes(res, 500, error);
	}
});

module.exports = router;
