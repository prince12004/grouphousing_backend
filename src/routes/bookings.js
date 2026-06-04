const express = require('express');
const router = express.Router();
const { createBooking, getUserBookings, getAllBookings, updateBookingStatus } = require('../controllers/bookingController');
const { protect, adminOnly, optionalAuth } = require('../middleware/auth');

router.post('/', optionalAuth, createBooking);
router.get('/my', protect, getUserBookings);
router.get('/admin/all', protect, adminOnly, getAllBookings);
router.patch('/:id/status', protect, adminOnly, updateBookingStatus);

module.exports = router;
