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
      {
        title: 'Luxury Heights Noida', type: 'Residential', status: 'Active', approvalStatus: 'approved',
        description: 'Premium residential complex in the heart of Noida with world-class amenities, 24/7 security, and excellent connectivity to Delhi NCR.',
        shortDescription: 'Premium residential complex in Noida',
        location: { city: 'Noida', state: 'Uttar Pradesh', address: 'Sector 62, Noida, UP 201309', landmark: 'Near Metro Station' },
        pricing: { startingPrice: 2500000, maxPrice: 5000000, pricePerSqft: 4500 },
        roi: { expectedROI: 15, minROI: 12, maxROI: 18, roiTimeline: '3-5 years' },
        area: { totalArea: 50000, minUnit: 1000, maxUnit: 2500, areaUnit: 'sqft' },
        slots: { total: 100, available: 45, booked: 55 }, progress: 55,
        timeline: { launchDate: new Date('2024-01-01'), possessionDate: new Date('2026-06-01') },
        amenities: [{ name: 'Swimming Pool', icon: '🏊' }, { name: 'Gym & Fitness', icon: '💪' }, { name: 'Club House', icon: '🏠' }, { name: 'Kids Play Area', icon: '🎡' }, { name: '24/7 Security', icon: '🔒' }, { name: 'Power Backup', icon: '⚡' }, { name: 'Parking', icon: '🚗' }, { name: 'Garden', icon: '🌳' }],
        highlights: ['RERA Registered', 'Prime Location', 'Earthquake Resistant', '100% Legal Titles', 'Ready Possession', 'Renowned Developer'],
        isFeatured: true, coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
        rera: { reraNumber: 'RERA/UP/1234/2024' },
      },
      {
        title: 'Green Valley Pune', type: 'Residential', status: 'Active', approvalStatus: 'approved',
        description: 'Eco-friendly residential project in Pune with solar panels, rainwater harvesting, and organic gardens. Perfect for environment-conscious investors.',
        location: { city: 'Pune', state: 'Maharashtra', address: 'Baner Road, Pune 411045' },
        pricing: { startingPrice: 3200000, maxPrice: 6500000, pricePerSqft: 5200 },
        roi: { expectedROI: 13, minROI: 11, maxROI: 16 },
        area: { totalArea: 40000, minUnit: 800, maxUnit: 2000, areaUnit: 'sqft' },
        slots: { total: 80, available: 30, booked: 50 }, progress: 65,
        timeline: { launchDate: new Date('2024-03-01'), possessionDate: new Date('2026-12-01') },
        amenities: [{ name: 'Solar Power', icon: '☀️' }, { name: 'EV Charging', icon: '🔋' }, { name: 'Organic Garden', icon: '🌱' }],
        highlights: ['Eco-Friendly', 'Green Building Certified', 'Smart Home Ready'],
        isFeatured: true, coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      },
      {
        title: 'Business Hub Bangalore', type: 'Commercial', status: 'Active', approvalStatus: 'approved',
        description: 'Premium Grade A commercial office space in Bangalore\'s tech hub. Ideal for IT companies and startups with excellent returns.',
        location: { city: 'Bangalore', state: 'Karnataka', address: 'Whitefield, Bangalore 560066' },
        pricing: { startingPrice: 5000000, maxPrice: 15000000, pricePerSqft: 7500 },
        roi: { expectedROI: 20, minROI: 16, maxROI: 25 },
        area: { totalArea: 100000, minUnit: 500, maxUnit: 5000, areaUnit: 'sqft' },
        slots: { total: 50, available: 18, booked: 32 }, progress: 70,
        timeline: { launchDate: new Date('2023-06-01'), possessionDate: new Date('2025-12-01') },
        amenities: [{ name: 'Conference Rooms', icon: '🏛️' }, { name: 'Cafeteria', icon: '☕' }, { name: 'Server Room', icon: '🖥️' }],
        highlights: ['Grade A Office', 'Metro Connectivity', 'Pre-leased Tenants', 'Guaranteed Rent'],
        isFeatured: true, coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
      },
      {
        title: 'Royal Villas Hyderabad', type: 'Villa', status: 'Upcoming', approvalStatus: 'approved',
        description: 'Exclusive villa project in Hyderabad\'s premium neighborhood. Gated community with private gardens and luxury interiors.',
        location: { city: 'Hyderabad', state: 'Telangana', address: 'Gachibowli, Hyderabad 500032' },
        pricing: { startingPrice: 8000000, maxPrice: 20000000 },
        roi: { expectedROI: 18, minROI: 15, maxROI: 22 },
        area: { totalArea: 200000, minUnit: 3000, maxUnit: 8000, areaUnit: 'sqft' },
        slots: { total: 30, available: 25, booked: 5 }, progress: 15,
        timeline: { launchDate: new Date('2024-06-01'), possessionDate: new Date('2027-03-01') },
        amenities: [{ name: 'Private Pool', icon: '🏊' }, { name: 'Home Theater', icon: '🎬' }, { name: 'Smart Home', icon: '🏠' }],
        highlights: ['Luxury Villas', 'Private Gardens', 'Concierge Service', '24/7 Security'],
        isFeatured: true, coverImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
      },
      {
        title: 'Smart City Plots Delhi', type: 'Plot', status: 'Active', approvalStatus: 'approved',
        description: 'DTCP approved plots in a planned township near Delhi. Excellent appreciation potential with all utilities in place.',
        location: { city: 'Delhi NCR', state: 'Delhi', address: 'NH-8, Dwarka Expressway, Delhi' },
        pricing: { startingPrice: 1800000, maxPrice: 8000000, pricePerSqft: 3200 },
        roi: { expectedROI: 22, minROI: 18, maxROI: 28 },
        area: { totalArea: 500000, minUnit: 200, maxUnit: 1000, areaUnit: 'sqyd' },
        slots: { total: 200, available: 80, booked: 120 }, progress: 60,
        timeline: { launchDate: new Date('2023-01-01'), possessionDate: new Date('2025-03-01') },
        highlights: ['DTCP Approved', 'Ready Possession', 'All Utilities', 'Good Appreciation'],
        isFeatured: true, coverImage: 'https://images.unsplash.com/photo-1448630360428-65456885c650?w=800&q=80',
      },
      {
        title: 'Coastal Apartments Mumbai', type: 'Apartment', status: 'Active', approvalStatus: 'approved',
        description: 'Sea-facing luxury apartments in Mumbai with panoramic ocean views. Premium finishing and world-class amenities.',
        location: { city: 'Mumbai', state: 'Maharashtra', address: 'Worli Sea Face, Mumbai 400018' },
        pricing: { startingPrice: 12000000, maxPrice: 30000000, pricePerSqft: 25000 },
        roi: { expectedROI: 10, minROI: 8, maxROI: 14 },
        area: { totalArea: 30000, minUnit: 800, maxUnit: 3000, areaUnit: 'sqft' },
        slots: { total: 40, available: 15, booked: 25 }, progress: 80,
        timeline: { launchDate: new Date('2023-06-01'), possessionDate: new Date('2025-06-01') },
        amenities: [{ name: 'Sea View', icon: '🌊' }, { name: 'Rooftop Pool', icon: '🏊' }, { name: 'Concierge', icon: '🎩' }],
        highlights: ['Sea Facing', 'Ready to Move', 'Premium Finishes', 'Luxury Lifestyle'],
        isFeatured: false, coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
      },
    ];

    for (const p of projects) {
      await Project.create(p);
    }
    console.log(`✅ ${projects.length} projects seeded`);
  }

  // Seed FAQs
  const faqCount = await FAQ.countDocuments();
  if (faqCount === 0) {
    await FAQ.insertMany([
      { question: 'What is Group Housing?', answer: 'Group Housing is a collaborative investment model where multiple investors pool resources to develop residential or commercial properties.', order: 1 },
      { question: 'What is the minimum investment?', answer: 'Minimum investment starts from ₹5 Lakhs, varying by project.', order: 2 },
      { question: 'Are projects legally protected?', answer: 'All projects are RERA registered and legally verified by our team of real estate attorneys.', order: 3 },
      { question: 'What is the expected ROI?', answer: 'Returns typically range from 10-25% annually depending on project type and location.', order: 4 },
      { question: 'Can I exit my investment?', answer: 'Yes, through our secondary market feature. You can list your investment share for sale to other investors.', order: 5 },
    ]);
    console.log('✅ FAQs seeded');
  }

  // Seed Testimonials
  const tCount = await Testimonial.countDocuments();
  if (tCount === 0) {
    await Testimonial.insertMany([
      { name: 'Rajesh Sharma', designation: 'IT Professional', message: 'GroupHousing Pro transformed my investment journey. Excellent ROI and transparent process!', rating: 5, avatar: 'https://i.pravatar.cc/80?img=1', isActive: true, isFeatured: true },
      { name: 'Priya Patel', designation: 'Entrepreneur', message: 'Best investment platform I have used. The team is highly professional and the returns exceeded expectations.', rating: 5, avatar: 'https://i.pravatar.cc/80?img=5', isActive: true, isFeatured: true },
      { name: 'Amit Kumar', designation: 'Bank Manager', message: 'Fully transparent and legally secure. I invested in two projects and both are performing well.', rating: 5, avatar: 'https://i.pravatar.cc/80?img=3', isActive: true, isFeatured: true },
    ]);
    console.log('✅ Testimonials seeded');
  }

  // Seed Settings
  const settingsCount = await Settings.countDocuments();
  if (settingsCount === 0) {
    await Settings.create({ siteName: 'GroupHousing Pro', tagline: 'Creating Dreams Together', email: 'info@grouphousingpro.com', phone: '+91 99999 99999', whatsappNumber: '+919999999999' });
    console.log('✅ Settings seeded');
  }

  console.log('\n🎉 Database seeding completed!');
  process.exit(0);
};

seed().catch(err => { console.error('Seed error:', err); process.exit(1); });
