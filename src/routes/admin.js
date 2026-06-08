const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllUsers, updateUser, deleteUser, toggleUserStatus,
  getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial,
  getFAQs, createFAQ, updateFAQ, deleteFAQ, getSettings, updateSettings,
  getPublicSettings } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

// Public read endpoints — no auth required
router.get('/testimonials', getTestimonials);
router.get('/faqs', getFAQs);
router.get('/settings/public', getPublicSettings);

// All routes below require admin authentication
router.use(protect, adminOnly);

router.get('/dashboard', getDashboardStats);

router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/toggle-status', toggleUserStatus);

router.post('/testimonials', createTestimonial);
router.put('/testimonials/:id', updateTestimonial);
router.delete('/testimonials/:id', deleteTestimonial);

router.post('/faqs', createFAQ);
router.put('/faqs/:id', updateFAQ);
router.delete('/faqs/:id', deleteFAQ);

router.get('/settings', getSettings);
router.put('/settings', updateSettings);

module.exports = router;
