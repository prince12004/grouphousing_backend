const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/project/:projectId', async (req, res) => {
  try {
    const reviews = await Review.find({ project: req.params.projectId, isApproved: true })
      .populate('user', 'fullName avatar').sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const existing = await Review.findOne({ project: req.body.project, user: req.user._id });
    if (existing) return res.status(400).json({ success: false, message: 'Already reviewed.' });
    const review = await Review.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, review });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.patch('/:id/approve', protect, adminOnly, async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { isApproved: req.body.isApproved }, { new: true });
    res.json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Review deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
