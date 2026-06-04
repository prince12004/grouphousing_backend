const express = require('express');
const router = express.Router();
const { getWishlist, toggleWishlist } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getWishlist);
router.post('/toggle', protect, toggleWishlist);

module.exports = router;
