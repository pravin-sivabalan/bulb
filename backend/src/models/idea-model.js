let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let IdeaSchema = new Schema({
    _user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    created_at: {
      type: Date,
      required: true
    },
    likes: {
      type: Number,
      default: 0
    }
});

let Idea = mongoose.model('Idea', IdeaSchema, 'idea');

module.exports = Idea;
