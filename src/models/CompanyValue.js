const mongoose = require('mongoose');

const companyValueSchema = new mongoose.Schema({
  icon: { type: String, default: 'Shield' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('CompanyValue', companyValueSchema);
