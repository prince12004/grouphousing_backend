const express = require('express');
const router = express.Router();
const { createContactMessage, getAllContacts } = require('../controllers/leadController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', createContactMessage);
router.get('/admin/all', protect, adminOnly, getAllContacts);

module.exports = router;
