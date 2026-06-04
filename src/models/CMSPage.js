const mongoose = require('mongoose');

const cmsPageSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  metaTitle: String,
  metaDescription: String,
  isActive: { type: Boolean, default: true },
  lastEditedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('CMSPage', cmsPageSchema);
