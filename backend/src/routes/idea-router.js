const { successRes, errorRes } = require('../utils');
const express = require('express');
const User = require('../models/user-model');
const Idea = require('../models/idea-model');
const Like = require('../models/like-model');
const Authorized = require('../utils/middleware');
const router = express.Router();

router.get('/', Authorized, async (req, res) => {
	try {
		const query = {}; 
		
		if (req.query.type === 'global') {
			// Global feed
		}
		else if (req.query.type === 'follow') {
			// TODO: add follow feed
			const currentUser = await User.findById(req.user.id).exec();
			console.log('Current User following:', currentUser.following);
			const following = await User.find({
				_id : {
					$all: currentUser.following
				}
			});

			query._user = following;
		}
		else return errorRes(res, 400, `Invalid feed type: ${req.query.type}`);

		const ideas = await Idea.find(query).populate('_user', ['_id', 'firstName', 'lastName', 'email', 'likes']).exec();
		return successRes(res, ideas);
	} catch (error) {
		return errorRes(res, 500, error);
	}
});

router.get('/:id', Authorized, async (req, res) => {
	try {
		const idea = await Idea.findById(req.params.id).exec();
		if (!idea) return errorRes(res, 404, 'Idea not found');
		return successRes(res, idea);
	} catch (error) {
		return errorRes(res, 500, error);
	}
});

router.delete('/:id', Authorized, async (req, res) => {
	try {
		const idea = await Idea.findById(req.params.id).exec();
		if (!idea) return errorRes(res, 404, 'Idea not found');
		if (req.user.id != idea._user) return errorRes(res, 401, 'User is unauthorized to delete this idea');
		// const oldIdea = await Idea.findByIdAndRemove(req.params.id).exec();
		const oldIdea = await idea.remove();
		return successRes(res, oldIdea);
	} catch (error) {
		return errorRes(res, 500, error);
	}
});

router.post('/', Authorized, async (req, res) => {
	try {
		if (!req.body.title) return errorRes(res, 400, 'Idea must have a title');
		if (!req.body.description) return errorRes(res, 400, 'Idea must have a description');

		const idea = Idea({
			_user: req.user.id,
			title: req.body.title,
			description: req.body.description,
			_tags: req.body.tags ? req.body.tags : [],
		});

		const newIdea = await idea.save();
		return successRes(res, newIdea);
	} catch (error) {
		return errorRes(res, 500, error);
	}
});

router.get('/user/:id', async (req, res) => {
	try {
		const ideas = await Idea.find({ _user: req.params.id }).populate('_user', ['_id', 'firstName', 'lastName', 'email']).exec();
		return successRes(res, ideas);
	} catch (error) {
		return errorRes(res, 500, error);
	}
});

router.put('/like/:id', Authorized, async (req, res) => {
	try {
		const idea = await Idea.find({_id: req.params.id}).exec();
		if(!idea) return errorRes(res, 404, 'Idea not found');

		const hasLiked = await Like.find({_user: req.user.id, _idea: req.params.id}).exec();
		if(hasLiked) return errorRes(res, 409, 'User has already liked this idea');

		const like = Like({
			_user: req.user.id,
			_idea: req.params.id
		});

		idea.likes += 1;

		const newLike = await like.save();
		const updatedIdea = await idea.save();
		return successRes(res, updatedIdea);

	} catch (error) {
		return errorRes(res, 500, error);
	}
});

router.put('/unlike/:id', Authorized, async (req, res) => {
	try {
		const idea = await Idea.find({_id: req.params.id}).exec();
		if(!idea) return errorRes(res, 404, 'Idea not found');

		const like = await Like.find({_user: req.user.id, _idea: req.params.id}).remove().exec();
		if(!like) return errorRes(res, 404, 'User has not liked this idea');

		idea.likes -= 1;

		const updatedIdea = await idea.save();
		return successRes(res, updatedIdea);

	} catch (error) {
		return errorRes(res, 500, error);
	}
});

module.exports = router;
