const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  course_name: {type: String, required: true},
  course_description: {type: String, required: true},
  category: {type: String, required: true},
  link: {type: String, required: true},
  cover_image: {type: String, required: true},
  rating: {type: Number, required: true},
  favorites: {type: Number, required: true},
  user_image: {type: String, required: true},
  user_name: {type: String, required: true},
}, {
  timestamps: true,
});

const suggestedSchema = new Schema({
  suggestion_courses: [courseSchema],
}, {
  timestamps: true,
});

const Suggestions = mongoose.model('Suggestions', suggestedSchema);

module.exports = Suggestions;