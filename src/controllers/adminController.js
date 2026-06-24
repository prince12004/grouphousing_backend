const User = require('../models/User');
const Project = require('../models/Project');
const Booking = require('../models/Booking');
const Lead = require('../models/Lead');
const Testimonial = require('../models/Testimonial');
const FAQ = require('../models/FAQ');
const Settings = require('../models/Settings');
const TeamMember = require('../models/TeamMember');
const Milestone = require('../models/Milestone');
const CompanyValue = require('../models/CompanyValue');
const ConceptStep = require('../models/ConceptStep');
const ConceptBenefit = require('../models/ConceptBenefit');
const PageContent = require('../models/PageContent');

exports.getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalProjects, totalLeads, totalBookings,
      activeProjects, pendingProjects, newLeadsToday, revenueData] = await Promise.all([
        User.countDocuments({ role: 'user' }),
        Project.countDocuments(),
        Lead.countDocuments(),
        Booking.countDocuments(),
        Project.countDocuments({ status: 'Active', approvalStatus: 'approved' }),
        Project.countDocuments({ approvalStatus: 'pending' }),
        Lead.countDocuments({ createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } }),
        Booking.aggregate([{ $group: { _id: null, total: { $sum: '$investmentAmount' } } }]),
      ]);

    const userGrowth = await User.aggregate([
      { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }, { $limit: 6 },
    ]);

    const leadGrowth = await Lead.aggregate([
      { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }, { $limit: 6 },
    ]);

    res.json({
      success: true,
      stats: { totalUsers, totalProjects, totalLeads, totalBookings, activeProjects, pendingProjects, newLeadsToday, totalRevenue: revenueData[0]?.total || 0 },
      charts: { userGrowth, leadGrowth },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role, isActive } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (search) filter.$or = [{ fullName: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }, { mobile: new RegExp(search, 'i') }];

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      User.countDocuments(filter),
    ]);
    res.json({ success: true, users, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'suspended'}.`, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Testimonials
exports.getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isActive: true }).sort({ order: 1 });
    res.json({ success: true, testimonials });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json({ success: true, testimonial });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, testimonial });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteTestimonial = async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ order: 1 });
    res.json({ success: true, testimonials });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// FAQs
exports.getFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find({ isActive: true }).sort({ order: 1 });
    res.json({ success: true, faqs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createFAQ = async (req, res) => {
  try {
    const faq = await FAQ.create(req.body);
    res.status(201).json({ success: true, faq });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, faq });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteFAQ = async (req, res) => {
  try {
    await FAQ.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ order: 1 });
    res.json({ success: true, faqs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Settings
exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const settings = await Settings.findOneAndUpdate(
      {},
      { $set: req.body },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getPublicSettings = async (req, res) => {
  try {
    const settings = await Settings.findOne().select('siteName tagline contact social');
    res.json({ success: true, settings: settings || {} });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

// Generic CRUD for repeating content sections (team, milestones, values, concept steps/benefits)
function makeContentCrud(Model, listKey) {
  const singleKey = listKey.endsWith('s') ? listKey.slice(0, -1) : listKey;
  return {
    getActive: async (req, res) => {
      try {
        const items = await Model.find({ isActive: true }).sort({ order: 1 });
        res.json({ success: true, [listKey]: items });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    },
    getAll: async (req, res) => {
      try {
        const items = await Model.find().sort({ order: 1 });
        res.json({ success: true, [listKey]: items });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    },
    create: async (req, res) => {
      try {
        const item = await Model.create(req.body);
        res.status(201).json({ success: true, [singleKey]: item });
      } catch (err) {
        res.status(400).json({ success: false, message: err.message });
      }
    },
    update: async (req, res) => {
      try {
        const item = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, [singleKey]: item });
      } catch (err) {
        res.status(400).json({ success: false, message: err.message });
      }
    },
    remove: async (req, res) => {
      try {
        await Model.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Deleted.' });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    },
  };
}

const teamCrud = makeContentCrud(TeamMember, 'team');
exports.getTeam = teamCrud.getActive;
exports.getAllTeam = teamCrud.getAll;
exports.createTeamMember = teamCrud.create;
exports.updateTeamMember = teamCrud.update;
exports.deleteTeamMember = teamCrud.remove;

const milestoneCrud = makeContentCrud(Milestone, 'milestones');
exports.getMilestones = milestoneCrud.getActive;
exports.getAllMilestones = milestoneCrud.getAll;
exports.createMilestone = milestoneCrud.create;
exports.updateMilestone = milestoneCrud.update;
exports.deleteMilestone = milestoneCrud.remove;

const valueCrud = makeContentCrud(CompanyValue, 'values');
exports.getValues = valueCrud.getActive;
exports.getAllValues = valueCrud.getAll;
exports.createValue = valueCrud.create;
exports.updateValue = valueCrud.update;
exports.deleteValue = valueCrud.remove;

const stepCrud = makeContentCrud(ConceptStep, 'steps');
exports.getConceptSteps = stepCrud.getActive;
exports.getAllConceptSteps = stepCrud.getAll;
exports.createConceptStep = stepCrud.create;
exports.updateConceptStep = stepCrud.update;
exports.deleteConceptStep = stepCrud.remove;

const benefitCrud = makeContentCrud(ConceptBenefit, 'benefits');
exports.getConceptBenefits = benefitCrud.getActive;
exports.getAllConceptBenefits = benefitCrud.getAll;
exports.createConceptBenefit = benefitCrud.create;
exports.updateConceptBenefit = benefitCrud.update;
exports.deleteConceptBenefit = benefitCrud.remove;

// Page content (singleton per page slug — hero/mission/cta text blocks)
exports.getPageContent = async (req, res) => {
  try {
    const doc = await PageContent.findOne({ page: req.params.page });
    res.json({ success: true, content: doc?.data || {} });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updatePageContent = async (req, res) => {
  try {
    const doc = await PageContent.findOneAndUpdate(
      { page: req.params.page },
      { $set: { data: req.body } },
      { new: true, upsert: true }
    );
    res.json({ success: true, content: doc.data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.uploadPhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    res.json({ success: true, url: req.file.path, publicId: req.file.filename });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
