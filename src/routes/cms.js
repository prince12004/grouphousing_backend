const express = require('express');
const router = express.Router();
const CMSPage = require('../models/CMSPage');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/:slug', async (req, res) => {
  try {
    const page = await CMSPage.findOne({ slug: req.params.slug, isActive: true });
    if (!page) return res.status(404).json({ success: false, message: 'Page not found.' });
    res.json({ success: true, page });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const pages = await CMSPage.find().sort({ updatedAt: -1 });
    res.json({ success: true, pages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const page = await CMSPage.create({ ...req.body, lastEditedBy: req.user._id });
    res.status(201).json({ success: true, page });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const page = await CMSPage.findByIdAndUpdate(req.params.id, { ...req.body, lastEditedBy: req.user._id }, { new: true });
    res.json({ success: true, page });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await CMSPage.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Page deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
