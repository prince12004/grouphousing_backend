const mongoose = require('mongoose');
const slugify = require('slugify');

const amenitySchema = new mongoose.Schema({
  name: String,
  icon: String,
});

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, sparse: true },
  description: { type: String, required: true },
  shortDescription: { type: String },
  type: { type: String, enum: ['Residential', 'Commercial', 'Mixed-Use', 'Villa', 'Apartment', 'Plot'], required: true },
  status: { type: String, enum: ['Upcoming', 'Active', 'Funded', 'Completed', 'Paused'], default: 'Active' },
  approvalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },

  location: {
    city: { type: String, required: true },
    state: String,
    address: String,
    landmark: String,
    coordinates: { lat: Number, lng: Number },
    googleMapUrl: String,
  },

  pricing: {
    startingPrice: { type: Number, required: true },
    maxPrice: Number,
    pricePerSqft: Number,
    currency: { type: String, default: 'INR' },
  },

  roi: {
    expectedROI: { type: Number },
    minROI: Number,
    maxROI: Number,
    roiTimeline: String,
  },

  area: {
    totalArea: Number,
    minUnit: Number,
    maxUnit: Number,
    areaUnit: { type: String, default: 'sqft' },
  },

  timeline: {
    launchDate: Date,
    possessionDate: Date,
    completionDate: Date,
    constructionPhase: String,
  },

  slots: {
    total: { type: Number, default: 100 },
    available: { type: Number, default: 100 },
    booked: { type: Number, default: 0 },
  },

  progress: { type: Number, default: 0, min: 0, max: 100 },

  images: [{ url: String, publicId: String, caption: String, isPrimary: { type: Boolean, default: false } }],
  coverImage: { type: String },

  amenities: [amenitySchema],

  highlights: [String],
  tags: [String],

  developer: {
    name: String,
    logo: String,
    website: String,
    experience: String,
  },

  documents: [{ name: String, url: String, type: String }],

  rera: { reraNumber: String, reraUrl: String },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  views: { type: Number, default: 0 },
  wishlisted: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  metaTitle: String,
  metaDescription: String,
  metaKeywords: [String],
}, { timestamps: true });

projectSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true }) + '-' + Date.now();
  }
  next();
});

projectSchema.index({ 'location.city': 1, status: 1, type: 1 });
projectSchema.index({ 'pricing.startingPrice': 1 });

module.exports = mongoose.model('Project', projectSchema);
