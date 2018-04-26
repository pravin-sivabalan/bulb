let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let CommentSchema = new Schema(
	{
		_user: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			required: true,
		},
		_idea: {
			type: mongoose.Schema.ObjectId,
			ref: 'Idea',
			required: true
		},
		comment: {
			type: String,
			required: true,
		}
	},
	{ timestamps: { createdAt: 'createdAt' } }
);

let Comment = mongoose.model('Comment', CommentSchema, 'comments');

module.exports = Comment;
