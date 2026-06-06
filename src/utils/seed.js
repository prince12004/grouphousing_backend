require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Project = require('../models/Project');
const Testimonial = require('../models/Testimonial');
const FAQ = require('../models/FAQ');
const Settings = require('../models/Settings');

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Create admin user
  const existingAdmin = await User.findOne({ email: 'admin@grouphousingpro.com' });
  if (!existingAdmin) {
    await User.create({ fullName: 'Admin User', email: 'admin@grouphousingpro.com', mobile: '9999999999', password: 'Admin@123', role: 'superadmin', isVerified: true, isActive: true });
    console.log('✅ Admin user created: admin@grouphousingpro.com / Admin@123');
  }

  // Seed Projects
  const projectCount = await Project.countDocuments();
  if (projectCount === 0) {
    const projects = [
      // ── APPLE TREE ──────────────────────────────────────────────────────────
      {
        title: 'Apple Tree',
        type: 'Residential',
        status: 'Active',
        approvalStatus: 'approved',
        description: 'Apple Tree is a premium 3BHK residential project in Bangalore offering meticulously designed apartments across Ground to Third floor. With four distinct unit types (Aster, BlueBell, Camellia, Daisy) and carpet areas ranging from 1,530–1,545 sqft, each home is crafted for modern living. Rental options also available for select ready units.',
        shortDescription: 'Premium 3BHK residences in Bangalore — 15 units across 4 floors',
        location: {
          city: 'Bangalore',
          state: 'Karnataka',
          address: 'Bangalore, Karnataka',
          landmark: 'Panathur / Haralur Road / HSR / Sarjapur Road',
        },
        pricing: {
          startingPrice: 26898142,
          maxPrice: 27096850,
          pricePerSqft: 13000,
          currency: 'INR',
        },
        roi: { expectedROI: 12, minROI: 10, maxROI: 15, roiTimeline: '3-5 years' },
        area: { totalArea: 29700, minUnit: 1530, maxUnit: 1545, areaUnit: 'sqft' },
        slots: { total: 15, available: 7, booked: 8 },
        progress: 53,
        timeline: {
          launchDate: new Date('2024-01-01'),
          possessionDate: new Date('2026-07-01'),
        },
        amenities: [
          { name: 'Car Parking', icon: '🚗' },
          { name: 'BESCOM Power', icon: '⚡' },
          { name: 'BWSSB Water', icon: '💧' },
          { name: '24/7 Security', icon: '🔒' },
          { name: 'Power Backup', icon: '🔋' },
          { name: 'Landscaped Garden', icon: '🌳' },
        ],
        highlights: [
          '3BHK — Carpet 1,530–1,545 sqft',
          'SBU Area 1,984–1,998 sqft',
          'Rate ₹13,000/sqft',
          '4 Unit Types: Aster · BlueBell · Camellia · Daisy',
          'Rental Units Available from ₹45K–₹70K/month',
          'Ready & Under-Construction Units',
          'East & West Facing Options',
          'Prime Bangalore Location',
        ],
        tags: ['Apple Tree', '3BHK', 'Bangalore', 'Residential', 'Ready to Move', 'Rental'],
        isFeatured: true,
        coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
      },

      // ── APPLE GREEN ──────────────────────────────────────────────────────────
      {
        title: 'Apple Green',
        type: 'Residential',
        status: 'Active',
        approvalStatus: 'approved',
        description: 'Apple Green is an elegant 3BHK residential project in Bangalore featuring spacious apartments with carpet areas of 1,616–1,628 sqft. Spread across Ground to Third floors, the project offers four premium unit types (Aster, BlueBell, Camellia, Daisy) with North and East facing configurations. A rare investment opportunity in one of Bangalore\'s most sought-after corridors.',
        shortDescription: 'Spacious 3BHK residences in Bangalore — 16 units across 4 floors',
        location: {
          city: 'Bangalore',
          state: 'Karnataka',
          address: 'Bangalore, Karnataka',
          landmark: 'Nandi Hills / Indira Nagar / Jay Nagar / Sarjapur Road',
        },
        pricing: {
          startingPrice: 33073111,
          maxPrice: 33267019,
          pricePerSqft: 13000,
          currency: 'INR',
        },
        roi: { expectedROI: 13, minROI: 11, maxROI: 16, roiTimeline: '3-5 years' },
        area: { totalArea: 38992, minUnit: 1616, maxUnit: 1628, areaUnit: 'sqft' },
        slots: { total: 16, available: 6, booked: 10 },
        progress: 63,
        timeline: {
          launchDate: new Date('2024-01-01'),
          possessionDate: new Date('2026-12-01'),
        },
        amenities: [
          { name: 'Car Parking', icon: '🚗' },
          { name: 'BESCOM Power', icon: '⚡' },
          { name: 'BWSSB Water', icon: '💧' },
          { name: '24/7 Security', icon: '🔒' },
          { name: 'Power Backup', icon: '🔋' },
          { name: 'Landscaped Garden', icon: '🌳' },
          { name: 'Club House', icon: '🏠' },
        ],
        highlights: [
          '3BHK — Carpet 1,616–1,628 sqft',
          'SBU Area 2,439–2,453 sqft',
          'Rate ₹13,000/sqft',
          '4 Unit Types: Aster · BlueBell · Camellia · Daisy',
          'North & East Facing Options',
          'Premium Location in Bangalore',
          '10 of 16 Units Already Booked',
          'Limited Units Remaining',
        ],
        tags: ['Apple Green', '3BHK', 'Bangalore', 'Residential', 'Premium'],
        isFeatured: true,
        coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      },

      // ── NANDI CLOUD ──────────────────────────────────────────────────────────
      {
        title: 'Nandi Cloud',
        type: 'Apartment',
        status: 'Active',
        approvalStatus: 'approved',
        description: 'Nandi Clouds is a premium managed service apartment project at the foothills of Nandi Hills Main Road. The name symbolises the divine abode of Lord Shiva — blending tranquil surroundings with a modern hospitality-led investment model. Owners enjoy freehold title and dual benefits: assured monthly rental income via a long-term lease-back arrangement with the operating company, plus personal usage rights for family and friends during weekends or holidays. P1 offers 9 studio units (Floors 1–3) and P2 offers 19 studio units across three floors. Construction timeline: 18–24 months from plan sanction.',
        shortDescription: 'Managed service studio apartments at Nandi Hills — assured rental income + personal use',
        location: {
          city: 'Bangalore',
          state: 'Karnataka',
          address: 'Nandi Hills Main Road, Nandi Hills, Karnataka',
          landmark: 'Foothills of Nandi Hills',
        },
        pricing: {
          startingPrice: 4485380,
          maxPrice: 7452749,
          pricePerSqft: 7500,
          currency: 'INR',
        },
        roi: { expectedROI: 10, minROI: 8, maxROI: 14, roiTimeline: '2-3 years' },
        area: { totalArea: 19684, minUnit: 551, maxUnit: 932, areaUnit: 'sqft' },
        slots: { total: 28, available: 6, booked: 22 },
        progress: 79,
        timeline: {
          launchDate: new Date('2024-04-01'),
          possessionDate: new Date('2026-10-01'),
        },
        amenities: [
          { name: 'Infinity Swimming Pool', icon: '🏊' },
          { name: 'Club House (Terrace)',   icon: '🏠' },
          { name: 'Café',                   icon: '☕' },
          { name: 'Amphitheatre',           icon: '🎭' },
          { name: 'Children Play Area',     icon: '🎡' },
          { name: 'Senior Citizen Area',    icon: '🪑' },
          { name: 'Terrace Binocular Deck', icon: '🔭' },
          { name: 'Indoor Games',           icon: '🎮' },
          { name: 'Snooker',               icon: '🎱' },
          { name: 'Table Tennis',           icon: '🏓' },
          { name: 'Karaoke Deck',           icon: '🎤' },
          { name: 'Foosball',              icon: '⚽' },
          { name: 'Garden',                icon: '🌳' },
          { name: 'Rainwater Harvesting',   icon: '💧' },
          { name: 'STP',                   icon: '♻️' },
          { name: '24/7 CCTV & Security',  icon: '🔒' },
          { name: 'Guest Room (Common)',    icon: '🛎️' },
        ],
        highlights: [
          '1BHK Studio — SBU 551–932 sqft',
          'Rate ₹7,500/sqft',
          'Price Range ₹44.8L – ₹74.5L',
          'Freehold Ownership + Assured Rental Income',
          'Managed Hospitality Model',
          '22 of 28 Units Already Booked',
          'Only 6 Units Remaining',
          'Nandi Hills — Premium Hill Station Location',
          '2% Referral Commission for Owners',
          '18–24 Month Delivery Timeline',
        ],
        tags: ['Nandi Cloud', '1BHK', 'Studio', 'Nandi Hills', 'Managed Apartment', 'Assured Rental', 'Hospitality'],
        isFeatured: true,
        coverImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
      },
    ];

    for (const p of projects) {
      await Project.create(p);
    }
    console.log(`✅ ${projects.length} projects seeded (Apple Tree, Apple Green & Nandi Cloud)`);
  }

  // Seed FAQs
  const faqCount = await FAQ.countDocuments();
  if (faqCount === 0) {
    await FAQ.insertMany([
      { question: 'What is Group Housing?', answer: 'Group Housing is a collaborative investment model where multiple investors pool resources to develop premium residential properties in prime locations like Bangalore.', order: 1 },
      { question: 'What types of units are available?', answer: 'We offer 3BHK apartments in Apple Tree (carpet 1,530–1,545 sqft, from ₹2.69Cr) and Apple Green (carpet 1,616–1,628 sqft, from ₹3.31Cr), plus 1BHK Studio apartments in Nandi Cloud (SBU 551–932 sqft, from ₹44.8L) at Nandi Hills.', order: 2 },
      { question: 'What is the price per sqft?', answer: 'Apple Tree & Apple Green: ₹13,000/sqft. Nandi Cloud (managed studio apartments): ₹7,500/sqft starting from ₹44.8 Lakhs.', order: 3 },
      { question: 'What is Nandi Cloud?', answer: 'Nandi Cloud is a premium managed service apartment project at Nandi Hills. You get freehold ownership of a studio unit and earn assured monthly rental income via a lease-back with the operating company, while retaining personal usage rights for weekends and holidays.', order: 4 },
      { question: 'Are rental units available?', answer: 'Yes! Apple Tree offers ready 1BHK rental at ₹45K/month and 3BHK units at ₹70K/month from July 2026. Nandi Cloud offers assured rental income through the managed hospitality model.', order: 5 },
      { question: 'Are the projects legally protected?', answer: 'All projects are RERA registered and legally verified by our team of real estate attorneys to ensure 100% safe investment.', order: 6 },
      { question: 'What is the expected ROI?', answer: 'Apple Tree & Apple Green: 12–16% annually. Nandi Cloud: 8–14% annually through assured hospitality rental income.', order: 7 },
      { question: 'Which areas do you cover?', answer: 'We focus on premium Bangalore micro-markets: Panathur, Nandi Hills, Haralur Road, HSR Layout, Sarjapur Road, Indira Nagar, and Jayanagar.', order: 8 },
    ]);
    console.log('✅ FAQs seeded');
  }

  // Seed Testimonials
  const tCount = await Testimonial.countDocuments();
  if (tCount === 0) {
    await Testimonial.insertMany([
      { name: 'Rajesh Sharma', designation: 'IT Professional, Bangalore', message: 'Invested in Apple Tree through Group Housing. The process was transparent, the team was responsive, and possession timeline is on track!', rating: 5, avatar: 'https://i.pravatar.cc/80?img=1', isActive: true, isFeatured: true },
      { name: 'Priya Patel', designation: 'Entrepreneur, Bangalore', message: 'Apple Green is a fantastic project. Spacious 3BHKs at a great price per sqft. The North-facing Aster unit we booked has stunning views.', rating: 5, avatar: 'https://i.pravatar.cc/80?img=5', isActive: true, isFeatured: true },
      { name: 'Amit Kumar', designation: 'Senior Manager, TCS', message: 'Fully transparent process. The availability list was shared upfront. Booked a BlueBell unit in Apple Tree — excellent investment in Bangalore.', rating: 5, avatar: 'https://i.pravatar.cc/80?img=3', isActive: true, isFeatured: true },
    ]);
    console.log('✅ Testimonials seeded');
  }

  // Seed Settings
  const settingsCount = await Settings.countDocuments();
  if (settingsCount === 0) {
    await Settings.create({
      siteName: 'Group Housing',
      tagline: 'Creating Dreams Together',
      email: 'ghousing.connect@gmail.com',
      phone: '+91 99999 99999',
      whatsappNumber: '+919999999999',
      address: 'Bangalore, Karnataka, India',
      socialLinks: {
        facebook: 'https://www.facebook.com/ghousing.connect',
        instagram: 'https://www.instagram.com/group.housing',
        twitter: 'https://www.twitter.com/ghousing.connect',
        youtube: '',
        linkedin: '',
      },
    });
    console.log('✅ Settings seeded');
  }

  console.log('\n🎉 Database seeding completed!');
  process.exit(0);
};

seed().catch(err => { console.error('Seed error:', err); process.exit(1); });
