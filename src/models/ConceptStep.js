const mongoose = require('mongoose');

const conceptStepSchema = new mongoose.Schema({
  stepNumber: { type: String, required: true },
  icon: { type: String, default: 'Search' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  color: { type: String, default: 'from-primary-700 to-secondary' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('ConceptStep', conceptStepSchema);
