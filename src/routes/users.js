const express = require('express');
const router = express.Router();
const { getWishlist, toggleWishlist, getNotifications, markNotificationsRead } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/wishlist', protect, getWishlist);
router.post('/wishlist/toggle', protect, toggleWishlist);
router.get('/notifications', protect, getNotifications);
router.put('/notifications/read', protect, markNotificationsRead);

module.exports = router;
