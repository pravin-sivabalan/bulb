let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let IdeaSchema = new Schema(
  {
    _user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    friends: {
      type: [mongoose.Schema.ObjectId],
      ref: 'User',
      default: [],
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: { createdAt: 'createdAt' } }
);

let Idea = mongoose.model('Idea', IdeaSchema, 'idea');

module.exports = Idea;
