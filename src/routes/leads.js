const express = require('express');
const router = express.Router();
const { createLead, getAllLeads, updateLeadStatus, getLeadStats } = require('../controllers/leadController');
const { protect, adminOnly, optionalAuth } = require('../middleware/auth');

router.post('/', optionalAuth, createLead);
router.get('/admin/all', protect, adminOnly, getAllLeads);
router.get('/admin/stats', protect, adminOnly, getLeadStats);
router.patch('/:id', protect, adminOnly, updateLeadStatus);

module.exports = router;
