const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: String,
  company: String,
  avatar: String,
  message: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  videoUrl: String,
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);
