let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let TagSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  ideas: {
    type: String,
    default: [],
  },
});

let Tag = mongoose.model('Tag', TagSchema, 'tag');

module.exports = Tag;
