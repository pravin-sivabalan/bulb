let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let IdeaSchema = new Schema({
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    createdAt: {
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
