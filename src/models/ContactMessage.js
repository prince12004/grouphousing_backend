const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  mobile: String,
  subject: String,
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  isReplied: { type: Boolean, default: false },
  reply: String,
  repliedAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
