const mongoose = require('mongoose');

const conceptBenefitSchema = new mongoose.Schema({
  icon: { type: String, default: 'Shield' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  tag: { type: String, default: 'General' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('ConceptBenefit', conceptBenefitSchema);
