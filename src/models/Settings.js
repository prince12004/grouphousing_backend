const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  siteName: { type: String, default: 'GroupHousing Pro' },
  tagline: { type: String, default: 'Creating Dreams Together' },
  logo: String,
  favicon: String,
  email: String,
  phone: String,
  whatsappNumber: String,
  address: String,
  socialLinks: {
    facebook: String,
    instagram: String,
    twitter: String,
    linkedin: String,
    youtube: String,
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String],
    googleAnalyticsId: String,
  },
  smtp: {
    host: String,
    port: Number,
    user: String,
    pass: String,
  },
  maintenanceMode: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
