const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const detailsSchema = new Schema({
  name: {type: String, required: true},
  password: {type: String, required: true},
  email: {type: String, required: true},
  username: {type: String, required: true},
  image: {type: String, required: true},
}, {
  timestamps: true,
});

const courseSchema = new Schema({
  course_name: {type: String},
  course_description: {type: String},
  category: {type: String},
  link: {type: String},
  cover_image: {type: String},
  rates_number: {type: Number, default: 0},
  rating: {type: Number},
  favorites: {type: Number},
  user_image: {type: String},
  user_name: {type: String},
}, {
  timestamps: true,
})

const userSchema = new Schema({
  isInstructor: {type: Boolean, required: true},
  isStudent: {type: Boolean, required: true},
  details: detailsSchema,
  favorites: [courseSchema],
  courses: [courseSchema]
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
