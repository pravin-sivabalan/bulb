const express = require('express');
const User = require('../models/user-model');
const { successRes, errorRes } = require('../utils');
const router = express.Router();

router.post('/signup', async (req, res) => {
	try {
		if (!req.body.firstName) return errorRes(res, 400, 'User must have a first name');
		if (!req.body.lastName) return errorRes(res, 400, 'User must have a last name');
		if (!req.body.email) return errorRes(res, 400, 'User must have an email');
		if (!req.body.password) return errorRes(res, 400, 'User must have a password');

		const existingUser = await User.findOne({ email: req.body.email }).exec();
		if (existingUser) return errorRes(res, 409, 'User already exists');

		const user = User({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			password: req.body.password,
		});

		const newUser = await user.save();

		return successRes(res, {
			user: {
				firstName: newUser.firstName,
				lastName: newUser.lastName,
				email: newUser.email,
				_id: newUser._id
			},
			token: user.generateJWT(),
		});
	} catch (error) {
		console.error('Server Error:', error);
		return errorRes(res, 500, error);
	}
});

router.post('/login', async (req, res) => {
	try {
		if (!req.body.email) return errorRes(res, 400, 'User must have an email');
		if (!req.body.password) return errorRes(res, 400, 'User must have a password');

		const user = await User.findOne({ email: req.body.email }).exec();
		if (!user) return errorRes(res, 404, 'Email does not exist');
		if (user.validatePassword(req.body.password))
			return successRes(res, {
				user,
				token: user.generateJWT(),
			});
		else return errorRes(res, 400, 'Invalid password');
	} catch (error) {
		console.error('Server Error:', error);
		return errorRes(res, 500, error);
	}
});

module.exports = router;
