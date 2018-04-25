let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let LikeSchema = new Schema(
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
		}
	}
);

let Like = mongoose.model('Like', LikeSchema, 'likes');

module.exports = Like;
