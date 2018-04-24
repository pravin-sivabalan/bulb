const { successRes, errorRes } = require('../utils');
const express = require('express');
const Idea = require('../models/idea-model');
const Authorized = require('../utils/middleware');
const router = express.Router();

router.get('/', Authorized, async (req, res) => {
	try {
		const query = {}; // Global feed

		if (req.query.type == 0) {
			// TODO: add friends
		} else if (req.query.type == 1) {
			query._user = req.user._id; // Personal feed
		}

		const ideas = await Idea.find(query).populate('_user', ['_id', 'firstName', 'lastName', 'email']).exec();
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
		Idea.findById(req.params.id).exec();
		if (!idea) return errorRes(res, 404, 'Idea not found');
		if (req.user.id != idea._user) return errorRes(res, 401, 'User is unauthorized to delete this idea');
		const oldIdea = await Idea.findByIdAndRemove(req.params.id).exec();
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

router.put('/:id', Authorized, async (req, res) => {
	try {
		const idea = await Idea.findById(req.params.id).exec();
		if (req.query.like == 1)
			idea.likes += 1;
		else if (idea.likes > 0)
			idea.likes -= 1;

		const updatedIdea = await idea.save();
		return successRes(res, updatedIdea);
	} catch (error) {
		return errorRes(res, 500, error);
	}
});

module.exports = router;
