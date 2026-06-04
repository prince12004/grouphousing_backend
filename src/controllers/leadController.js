const Lead = require('../models/Lead');
const ContactMessage = require('../models/ContactMessage');
const { sendAdminLeadNotification } = require('../utils/email');
const { paginate } = require('../utils/helpers');

exports.createLead = async (req, res) => {
  try {
    const lead = await Lead.create({ ...req.body, user: req.user?._id });
    await sendAdminLeadNotification({ projectName: req.body.projectName || 'General', leadName: req.body.fullName, leadEmail: req.body.email, leadMobile: req.body.mobile });
    res.status(201).json({ success: true, message: 'Lead submitted!', lead });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllLeads = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search, projectId } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (projectId) filter.project = projectId;
    if (search) filter.$or = [{ fullName: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }, { mobile: new RegExp(search, 'i') }];

    const { skip, limit: lim } = paginate(page, limit);
    const [leads, total] = await Promise.all([
      Lead.find(filter).populate('project', 'title').sort({ createdAt: -1 }).skip(skip).limit(lim),
      Lead.countDocuments(filter),
    ]);
    res.json({ success: true, leads, total, page: parseInt(page), pages: Math.ceil(total / lim) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateLeadStatus = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, { status: req.body.status, ...req.body }, { new: true });
    res.json({ success: true, lead });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getLeadStats = async (req, res) => {
  try {
    const stats = await Lead.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const total = await Lead.countDocuments();
    res.json({ success: true, stats, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createContactMessage = async (req, res) => {
  try {
    const msg = await ContactMessage.create(req.body);
    res.status(201).json({ success: true, message: 'Message sent! We will respond within 24 hours.', data: msg });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllContacts = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const { skip, limit: lim } = paginate(page, limit);
    const [messages, total] = await Promise.all([
      ContactMessage.find().sort({ createdAt: -1 }).skip(skip).limit(lim),
      ContactMessage.countDocuments(),
    ]);
    res.json({ success: true, messages, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
