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
  course_name: {type: String, required: true},
  course_description: {type: String, required: true},
  category: {type: String, required: true},
  link: {type: String, required: true},
  thumbnail: {type: String, required: true},
  rating: {type: Number, required: true},
  favorites: {type: Number, required: true},
  user_image: {type: String, required: true},
  user_name: {type: String, required: true},
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
