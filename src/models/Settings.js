const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  siteName: { type: String, default: 'GroupHousing Pro' },
  tagline: { type: String, default: 'Creating Dreams Together' },
  description: String,
  logo: String,
  favicon: String,

  contact: {
    phone: String,
    whatsapp: String,
    email: String,
    supportEmail: String,
    address: String,
    mapUrl: String,
  },

  social: {
    facebook: String,
    instagram: String,
    twitter: String,
    linkedin: String,
    youtube: String,
  },

  seo: {
    metaTitle: String,
    metaDescription: String,
    metaKeywords: String,
    googleAnalytics: String,
    fbPixel: String,
  },

  maintenanceMode: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
