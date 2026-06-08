const Project = require('../models/Project');
const Review = require('../models/Review');
const { paginate } = require('../utils/helpers');

exports.getProjects = async (req, res) => {
  try {
    const { page = 1, limit = 12, city, type, status, minPrice, maxPrice, sort, search, featured } = req.query;
    const filter = { approvalStatus: 'approved' };

    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (featured === 'true') filter.isFeatured = true;
    if (minPrice || maxPrice) {
      filter['pricing.startingPrice'] = {};
      if (minPrice) filter['pricing.startingPrice'].$gte = Number(minPrice);
      if (maxPrice) filter['pricing.startingPrice'].$lte = Number(maxPrice);
    }
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { 'location.city': new RegExp(search, 'i') },
        { tags: new RegExp(search, 'i') },
      ];
    }

    const sortOptions = {
      latest: { createdAt: -1 },
      popular: { views: -1 },
      priceLow: { 'pricing.startingPrice': 1 },
      priceHigh: { 'pricing.startingPrice': -1 },
      roi: { 'roi.expectedROI': -1 },
    };

    const { skip, limit: lim } = paginate(page, limit);
    const [projects, total] = await Promise.all([
      Project.find(filter).sort(sortOptions[sort] || sortOptions.latest).skip(skip).limit(lim).select('-documents'),
      Project.countDocuments(filter),
    ]);

    res.json({ success: true, projects, total, page: parseInt(page), pages: Math.ceil(total / lim) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getProject = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const param = req.params.slug;
    const isId = mongoose.Types.ObjectId.isValid(param);
    const query = isId
      ? { $or: [{ slug: param }, { _id: param }] }
      : { slug: param };
    const project = await Project.findOne(query).populate('createdBy', 'fullName');

    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });

    await Project.findByIdAndUpdate(project._id, { $inc: { views: 1 } });

    const reviews = await Review.find({ project: project._id, isApproved: true })
      .populate('user', 'fullName avatar').sort({ createdAt: -1 }).limit(10);

    const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : 0;

    res.json({ success: true, project, reviews, avgRating: parseFloat(avgRating) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getFeaturedProjects = async (req, res) => {
  try {
    const projects = await Project.find({ isFeatured: true, approvalStatus: 'approved', status: { $in: ['Active', 'Upcoming'] } })
      .sort({ createdAt: -1 }).limit(6).select('-documents -amenities');
    res.json({ success: true, projects });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCities = async (req, res) => {
  try {
    const cities = await Project.distinct('location.city', { approvalStatus: 'approved' });
    res.json({ success: true, cities: cities.filter(Boolean).sort() });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getSimilarProjects = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Not found.' });

    const similar = await Project.find({
      _id: { $ne: project._id },
      approvalStatus: 'approved',
      $or: [{ 'location.city': project.location.city }, { type: project.type }],
    }).limit(4).select('-documents -amenities');

    res.json({ success: true, projects: similar });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin - CRUD
exports.createProject = async (req, res) => {
  try {
    const project = await Project.create({ ...req.body, createdBy: req.user._id, approvalStatus: 'approved' });
    res.status(201).json({ success: true, message: 'Project created!', project });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    // Use $set explicitly so images/documents/other unspecified fields are never cleared
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!project) return res.status(404).json({ success: false, message: 'Not found.' });
    res.json({ success: true, message: 'Project updated!', project });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Project deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.approveProject = async (req, res) => {
  try {
    const { status } = req.body;
    const project = await Project.findByIdAndUpdate(req.params.id, { approvalStatus: status }, { new: true });
    res.json({ success: true, message: `Project ${status}!`, project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.uploadImages = async (req, res) => {
  try {
    if (!req.files?.length) return res.status(400).json({ success: false, message: 'No images uploaded.' });

    const fs = require('fs');
    const path = require('path');
    const uploadsDir = path.join(__dirname, '../../public/uploads');
    const isReplace = req.query.replace === 'true';

    // First batch: delete old files and replace
    if (isReplace) {
      const existing = await Project.findById(req.params.id).select('images');
      if (existing?.images?.length) {
        for (const img of existing.images) {
          try {
            const filename = img.url?.split('/uploads/').pop();
            if (filename) fs.unlinkSync(path.join(uploadsDir, filename));
          } catch (_) {}
        }
      }
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const images = req.files.map((f, i) => ({
      url: `${baseUrl}/uploads/${f.filename}`,
      isPrimary: i === 0,
    }));

    const update = isReplace
      ? { $set: { images, coverImage: images[0].url } }
      : { $push: { images: { $each: images } } };

    const project = await Project.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json({ success: true, message: 'Images uploaded!', images, project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const { id, imageId } = req.params;
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ success: false, message: 'Not found.' });

    const image = project.images.find(img => img._id?.toString() === imageId);
    if (image?.url) {
      const fs = require('fs');
      const path = require('path');
      const filename = image.url.split('/uploads/').pop();
      if (filename) {
        try { require('fs').unlinkSync(require('path').join(__dirname, '../../public/uploads', filename)); } catch (_) {}
      }
    }

    const updated = await Project.findByIdAndUpdate(
      id,
      { $pull: { images: { _id: imageId } } },
      { new: true }
    );
    res.json({ success: true, project: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllProjectsAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, approvalStatus, search } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (approvalStatus) filter.approvalStatus = approvalStatus;
    if (search) filter.$or = [{ title: new RegExp(search, 'i') }, { 'location.city': new RegExp(search, 'i') }];

    const { skip, limit: lim } = paginate(page, limit);
    const [projects, total] = await Promise.all([
      Project.find(filter).sort({ createdAt: -1 }).skip(skip).limit(lim),
      Project.countDocuments(filter),
    ]);
    res.json({ success: true, projects, total, page: parseInt(page), pages: Math.ceil(total / lim) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
