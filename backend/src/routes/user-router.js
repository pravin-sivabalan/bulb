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
		const user = await User
			.findOne({_id:req.params.id}, {password: 0})
			.populate({
				path: 'likes',
				select: ['_user', 'title', 'description', '_tags', 'likes'],
				model: 'Idea',
				populate: {
					path: '_user',
					select: ['_id', 'firstName', 'lastName', 'email', 'likes'],
					model: 'User'
				}
			})
			.exec();
		if (!user) return errorRes(res, 404, 'User not found');
		return successRes(res, user);
	} catch (error) {
		return errorRes(res, 500, error);
	}
});

router.post('/follow/:id', async (req, res) => {
	try {
		const user = await User.findById(req.user.id).exec();
		if(!user) return errorRes(res, 404, 'Cannot find user');

		let index = user.following.indexOf(req.params.id);
		if (index > -1) return errorRes(res, 404, 'Already following user');

		const followUser = await User.findById(req.params.id);
		if(!followUser) return errorRes(res, 404, 'Cannot find follower');

		user.following.push(followUser._id);
		followUser.followers.push(user._id);

		const newFollowUser = await followUser.save();
		const newUser = await user.save();

		return successRes(res, newUser);
	} catch (error) {
		console.error(error);
		return errorRes(res, 500, error);
	}
});

router.post('/unfollow/:id', async (req, res) => {
	try {
		const user = await User.findById(req.user.id).exec();
		if(!user) return errorRes(res, 404, 'Cannot find user');

		const unfollowUser = await User.findById(req.params.id);
		if(!unfollowUser) return errorRes(res, 404, 'Cannot find follower');

		let index = user.following.indexOf(unfollowUser._id);
		if (index > -1) {
			user.following.splice(index, 1);
		} else {
			return errorRes(res, 404, 'User is not following this user');
		}

		index = unfollowUser.followers.indexOf(user._id);
		if (index > -1) {
			unfollowUser.followers.splice(index, 1);
		} else {
			return errorRes(res, 404, 'User is not following this user');
		}

		const newUnfollowUser = await unfollowUser.save();
		const newUser = await user.save();

		return successRes(res, newUser);
	} catch (error) {
		console.error(error);
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

		const newUser = await User.findByIdAndUpdate(req.user.id, user, {new: true}).exec();

		return successRes(res, {
			user: newUser,
			token: user.generateJWT(),
		});
	} catch (error) {
		return errorRes(res, 500, error);
	}
});

router.delete('/', Authorized, async (req, res) => {
	try {
		// TODO: add remove from followers
		const user = await User.findByIdAndRemove(req.user.id).exec();
		if (!user) return errorRes(res, 404, 'User doesn\'t exist');
		const ideas = await Idea.find({ _user: req.user.id }).exec();
		ideas.forEach(async idea => await idea.remove());
		return successRes(res, user);
	} catch (error) {
		return errorRes(res, 500, error);
	}
});

module.exports = router;
