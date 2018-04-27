const { successRes, errorRes } = require('../utils');
const express = require('express');
const User = require('../models/user-model');
const Idea = require('../models/idea-model');
const Comment = require('../models/comment-model');
const Authorized = require('../utils/middleware');
const router = express.Router();

router.get('/', Authorized, async (req, res) => {
	try {
		const query = {};

		const currentUser = await User.findById(req.user.id).exec();
		if(!currentUser) return errorRes(res, 404, 'User not found');

		if (req.query.type === 'global') {
			// Global feed
		}
		else if (req.query.type === 'follow') { // TODO: add follow feed
			console.log('Current User following:', currentUser.following);
			const following = await User.find({
				_id : {
					$all: currentUser.following
				}
			});

			query._user = following;
		}
		else return errorRes(res, 400, `Invalid feed type: ${req.query.type}`);

		const ideas = await Idea
			.find(query)
			.populate('_user', ['_id', 'firstName', 'lastName', 'email', 'likes'])
			.sort({date: -1})
			.lean()
			.exec();
		// ideas.forEach((idea) => idea.userHasLiked = currentUser.likes.includes(req.params.id));

		return successRes(res, ideas);
	} catch (error) {
		return errorRes(res, 500, error);
	}
});

router.get('/:id', Authorized, async (req, res) => {
	try {
		const idea = await Idea
			.findById(req.params.id)
			.populate('_user', ['_id', 'firstName', 'lastName', 'email', 'likes'])
			.lean()
			.exec();
		if (!idea) return errorRes(res, 404, 'Idea not found');

		const comments = await Comment
			.find({_idea: req.params.id})
			.populate('_user', ['_id', 'firstName', 'lastName', 'email', 'likes'])
			.lean()
			.exec();
		idea.comments = comments;

		return successRes(res, idea);
	} catch (error) {
		return errorRes(res, 500, error);
	}
});

router.delete('/:id', Authorized, async (req, res) => {
	try {
		const idea = await Idea
			.findById(req.params.id)
			.populate('_user', ['_id', 'firstName', 'lastName', 'email'])
			.exec();
		if (!idea) return errorRes(res, 404, 'Idea not found');
		if (req.user.id !== idea._user) return errorRes(res, 401, 'User is unauthorized to delete this idea');
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
		const ideas = await Idea
			.find({ _user: req.params.id })
			.populate('_user', ['_id', 'firstName', 'lastName', 'email'])
			.exec();
		return successRes(res, ideas);
	} catch (error) {
		return errorRes(res, 500, error);
	}
});

router.post('/like/:id', Authorized, async (req, res) => {
	try {
		const idea = await Idea.findById({_id: req.params.id}).exec();
		if (!idea) return errorRes(res, 404, 'Idea not found');
		let user = await User.findById(req.user.id).exec();
		if (!user) return errorRes(res, 404, 'User does not exist');
		let alreadyLiked = false;
		user.likes.forEach(like => {
			if (like == req.params.id) alreadyLiked = true;
		});
		if (alreadyLiked) return errorRes(res, 409, 'User already liked this idea');

		user = await User
			.findByIdAndUpdate(
				req.user.id, 
				{
					$push: {
						likes: req.params.id
					}
				},
				{
					safe: true, 
					upsert: true, 
					new: true
				}
			)
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

		const newIdea = await Idea
			.findOneAndUpdate({ _id: req.params.id }, { $inc: { likes: 1 } }, {new: true })
			.populate('_user', ['_id', 'firstName', 'lastName', 'email'])
			.exec();

		return successRes(res, {
			idea: newIdea,
			user
		});
	} catch (error) {
		console.error(error);
		return errorRes(res, 500, error);
	}
});

router.post('/unlike/:id', Authorized, async (req, res) => {
	try {
		const idea = await Idea.findById(req.params.id).exec();
		if (!idea) return errorRes(res, 404, 'Idea not found');
		let user = await User.findById(req.user.id).exec();
		if (!user) return errorRes(res, 404, 'User does not exist');
		let alreadyLiked = false;
		user.likes.forEach(like => {
			if (like == req.params.id) alreadyLiked = true;
		});
		if (!alreadyLiked) return errorRes(res, 409, 'User did not liked this idea');

		user = await User
			.findByIdAndUpdate(
				req.user.id, 
				{
					$pull: {
						likes: req.params.id
					}
				},
				{
					safe: true, 
					upsert: true, 
					new: true
				}
			)
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

		const newIdea = await Idea
			.findOneAndUpdate({ _id: req.params.id }, { $inc: { likes: -1 } }, {new: true })
			.populate('_user', ['_id', 'firstName', 'lastName', 'email'])
			.exec();

		return successRes(res, {
			idea: newIdea,
			user
		});
	} catch (error) {
		return errorRes(res, 500, error);
	}
});

router.post('/comment/:id', Authorized, async (req, res) => {
	if(!req.params.id) return errorRes(res, 400, 'No idea id found in body');
	if(!req.body.comment) return errorRes(res, 400, 'No comment found in body');

	try {
		// const idea = Idea.findById(req.params.id).exec();
		let idea = Idea.findById(req.params.id).exec();
		if(!idea) return errorRes('Idea does not exist');

		const comment = Comment({
			_user: req.user.id,
			_idea: req.params.id,
			comment: req.body.comment
		});

		// const newComment = await comment.save();
		await comment.save();
		// return successRes(res, newComment);
		idea = await Idea
			.findById(req.params.id)
			.populate('_user', ['_id', 'firstName', 'lastName', 'email', 'likes'])
			.lean()
			.exec();
		if (!idea) return errorRes(res, 404, 'Idea not found');

		const comments = await Comment
			.find({_idea: req.params.id})
			.populate('_user', ['_id', 'firstName', 'lastName', 'email', 'likes'])
			.lean()
			.exec();
		idea.comments = comments;

		return successRes(res, idea);
	} catch(error) {
		return errorRes(res, 500, error);
	}
});

module.exports = router;
