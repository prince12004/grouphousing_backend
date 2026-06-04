const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: { type: String, unique: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  investmentAmount: { type: Number, required: true },
  message: { type: String },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'], default: 'Pending' },
  paymentStatus: { type: String, enum: ['Unpaid', 'Partial', 'Paid'], default: 'Unpaid' },
  notes: [{ note: String, addedBy: String, addedAt: { type: Date, default: Date.now } }],
  source: { type: String, enum: ['Website', 'WhatsApp', 'Phone', 'Walk-in'], default: 'Website' },
}, { timestamps: true });

bookingSchema.pre('save', function (next) {
  if (!this.bookingId) {
    this.bookingId = 'BK' + Date.now() + Math.floor(Math.random() * 1000);
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
