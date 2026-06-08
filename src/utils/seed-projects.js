require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Project = require('../models/Project');

// Titles of dummy/fake projects to remove
const DUMMY_TITLES = [
  'Luxury Heights Noida',
  'Green Valley Pune',
  'Business Hub Bangalore',
  'Royal Villas Hyderabad',
  'Smart City Plots Delhi',
  'Coastal Apartments Mumbai',
];

const REAL_PROJECTS = [
  {
    title: 'Apple Tree',
    type: 'Residential',
    status: 'Active',
    approvalStatus: 'approved',
    isFeatured: true,
    description:
      'Apple Tree is a premium 3BHK group housing project in Bangalore. ' +
      '15 thoughtfully designed units across Ground + 3 floors with 4 unit types — ' +
      'Aster (West-facing), BlueBell (West-facing), Camellia (East-facing), and Daisy (East-facing). ' +
      'Carpet area 1,530–1,545 sqft | SBU 1,984–1,998 sqft. ' +
      'Excellent rental yield — select floors ready for rental at ₹70K/month.',
    shortDescription: 'Premium 3BHK group housing — 15 units, 7 available, Bangalore',
    location: { city: 'Bangalore', state: 'Karnataka', address: 'Bangalore, Karnataka' },
    pricing: { startingPrice: 26900000, maxPrice: 27100000, pricePerSqft: 13000 },
    roi: { expectedROI: 10, minROI: 8, maxROI: 14, roiTimeline: '5 years' },
    area: { totalArea: 29760, minUnit: 1530, maxUnit: 1545, areaUnit: 'sqft' },
    slots: { total: 15, available: 7, booked: 8 },
    progress: 100,
    amenities: [
      { name: 'CCTV Surveillance', icon: '📷' },
      { name: '24/7 Security', icon: '🔒' },
      { name: 'Power Backup', icon: '⚡' },
      { name: 'Covered Parking', icon: '🚗' },
      { name: 'Lift', icon: '🛗' },
      { name: 'Landscaping', icon: '🌳' },
    ],
    highlights: [
      '15 units | 7 available',
      '3BHK — 1,530–1,545 sqft carpet',
      '₹13,000/sqft',
      'Rental ready — ₹70K/month (3BHK)',
      '4 types: Aster, BlueBell, Camellia, Daisy',
    ],
    coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
  },

  {
    title: 'Apple Green',
    type: 'Residential',
    status: 'Active',
    approvalStatus: 'approved',
    isFeatured: true,
    description:
      'Apple Green is a spacious 3BHK group housing project in Bangalore with 16 units ' +
      'across Ground + 3 floors. Unit types: Aster (North-facing), BlueBell (East-facing), ' +
      'Camellia (East-facing), Daisy (East-facing). ' +
      'Carpet area 1,616–1,628 sqft | SBU 2,439–2,453 sqft. ' +
      'Larger units than Apple Tree with strong rental demand.',
    shortDescription: 'Spacious 3BHK group housing — 16 units, 6 available, Bangalore',
    location: { city: 'Bangalore', state: 'Karnataka', address: 'Bangalore, Karnataka' },
    pricing: { startingPrice: 33100000, maxPrice: 33300000, pricePerSqft: 13000 },
    roi: { expectedROI: 10, minROI: 8, maxROI: 14, roiTimeline: '5 years' },
    area: { totalArea: 39216, minUnit: 1616, maxUnit: 1628, areaUnit: 'sqft' },
    slots: { total: 16, available: 6, booked: 10 },
    progress: 100,
    amenities: [
      { name: 'CCTV Surveillance', icon: '📷' },
      { name: '24/7 Security', icon: '🔒' },
      { name: 'Power Backup', icon: '⚡' },
      { name: 'Covered Parking', icon: '🚗' },
      { name: 'Lift', icon: '🛗' },
      { name: 'Landscaping', icon: '🌳' },
    ],
    highlights: [
      '16 units | 6 available',
      '3BHK — 1,616–1,628 sqft carpet',
      '₹13,000/sqft',
      'Larger SBU: 2,439–2,453 sqft',
      '4 types: Aster, BlueBell, Camellia, Daisy',
    ],
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
  },

  {
    title: 'Nandi Cloud',
    type: 'Apartment',
    status: 'Upcoming',
    approvalStatus: 'approved',
    isFeatured: true,
    description:
      'Nandi Cloud is a premium managed studio project on Nandi Hills Main Road, Bangalore. ' +
      '28 freehold studio units across two phases — P1 (9 units) and P2 (19 units). ' +
      'SBU 551–932 sqft at ₹7,500/sqft. Freehold ownership + lease-back model for ' +
      'assured rental income with personal usage rights. ' +
      'World-class amenities: Infinity pool, Clubhouse terrace, Café, Amphitheatre, ' +
      'Indoor games, Snooker, TT, Karaoke, Foosball, Garden, CCTV, 24/7 security, Guest room.',
    shortDescription: 'Managed studio resort — 28 units, 6 available, Nandi Hills Road',
    location: { city: 'Bangalore', state: 'Karnataka', address: 'Nandi Hills Main Road, Bangalore' },
    pricing: { startingPrice: 4485000, maxPrice: 7450000, pricePerSqft: 7500 },
    roi: { expectedROI: 12, minROI: 10, maxROI: 16, roiTimeline: '3 years' },
    area: { totalArea: 16016, minUnit: 551, maxUnit: 932, areaUnit: 'sqft' },
    slots: { total: 28, available: 6, booked: 22 },
    progress: 30,
    amenities: [
      { name: 'Infinity Pool', icon: '🏊' },
      { name: 'Clubhouse Terrace', icon: '🏛️' },
      { name: 'Café', icon: '☕' },
      { name: 'Amphitheatre', icon: '🎭' },
      { name: 'Indoor Games', icon: '🎮' },
      { name: 'Karaoke / Foosball', icon: '🎤' },
      { name: '24/7 Security', icon: '🔒' },
      { name: 'Guest Room', icon: '🛏️' },
    ],
    highlights: [
      '28 units | 6 available',
      'Freehold + lease-back model',
      'Assured rental income',
      'Personal usage rights',
      '₹7,500/sqft | ₹44.85L – ₹74.5L',
      'Nandi Hills Main Road location',
    ],
    coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
  },
];

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // 1. Remove dummy projects
  const del = await Project.deleteMany({ title: { $in: DUMMY_TITLES } });
  console.log(`🗑️  Removed ${del.deletedCount} dummy project(s)`);

  // 2. Add real projects (skip if already exists)
  for (const data of REAL_PROJECTS) {
    const existing = await Project.findOne({ title: data.title });
    if (existing) {
      console.log(`⚠️  "${data.title}" already exists — skipping`);
      continue;
    }
    const p = await Project.create(data);
    console.log(`✅  Created: ${p.title} (${p._id})`);
  }

  console.log('\nDone.');
  process.exit(0);
})().catch(err => { console.error(err); process.exit(1); });
