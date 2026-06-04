const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  leadId: { type: String, unique: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  budget: { type: Number },
  message: { type: String },
  status: { type: String, enum: ['New', 'Contacted', 'Interested', 'Converted', 'Closed'], default: 'New' },
  source: { type: String, enum: ['Website', 'WhatsApp', 'Phone', 'Email', 'Referral'], default: 'Website' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: [{ note: String, addedBy: String, addedAt: { type: Date, default: Date.now } }],
  followUpDate: Date,
  isConverted: { type: Boolean, default: false },
}, { timestamps: true });

leadSchema.pre('save', function (next) {
  if (!this.leadId) {
    this.leadId = 'LD' + Date.now() + Math.floor(Math.random() * 1000);
  }
  next();
});

module.exports = mongoose.model('Lead', leadSchema);
